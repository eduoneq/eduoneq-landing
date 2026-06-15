const DEFAULT_RECIPIENTS = 'gwangphago@gmail.com,ghcho@eduoneq.com';
const DEFAULT_SENDER_NAME = 'EDU ONEQ';

function doPost(event) {
  try {
    const payload = parsePayload(event);
    const scriptProperties = PropertiesService.getScriptProperties();
    const expectedSecret = scriptProperties.getProperty('WEBHOOK_SECRET') || '';

    if (expectedSecret && payload.secret !== expectedSecret) {
      return jsonResponse({
        ok: false,
        code: 'UNAUTHORIZED',
        message: 'Invalid webhook secret.'
      });
    }

    const recipients = cleanRecipientList(
      scriptProperties.getProperty('CONSULTATION_RECIPIENTS') || payload.to || DEFAULT_RECIPIENTS
    );

    if (!recipients) {
      return jsonResponse({
        ok: false,
        code: 'RECIPIENTS_MISSING',
        message: 'No consultation recipients configured.'
      });
    }

    const subject = cleanText(payload.subject, 'EDU ONEQ 상담 접수', 250);
    const text = cleanText(payload.text, 'EDU ONEQ 상담이 접수되었습니다.', 120000);
    const html = cleanText(payload.html, '', 180000);
    const replyTo = extractEmail(payload.replyTo);
    const options = {
      name: scriptProperties.getProperty('SENDER_NAME') || DEFAULT_SENDER_NAME
    };

    if (html) options.htmlBody = html;
    if (replyTo) options.replyTo = replyTo;

    MailApp.sendEmail(recipients, subject, text, options);

    return jsonResponse({
      ok: true,
      id: payload.id || '',
      mailId: payload.id || '',
      remainingDailyQuota: MailApp.getRemainingDailyQuota()
    });
  } catch (error) {
    return jsonResponse({
      ok: false,
      code: 'SERVER_ERROR',
      message: error && error.message ? error.message : 'Google Apps Script mailer error.'
    });
  }
}

function parsePayload(event) {
  const raw = event && event.postData && event.postData.contents ? event.postData.contents : '{}';
  return JSON.parse(raw);
}

function cleanText(value, fallback, maxLength) {
  const text = String(value || '').trim();
  return (text || fallback).slice(0, maxLength);
}

function cleanRecipientList(value) {
  return String(value || '')
    .split(',')
    .map(function (item) {
      return item.trim();
    })
    .filter(function (item) {
      return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(item);
    })
    .join(',');
}

function extractEmail(value) {
  const match = String(value || '').match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return match ? match[0] : '';
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}


function doPost(e) {
  try {
    var properties = PropertiesService.getScriptProperties();
    var payload = parsePayload(e);
    var configuredSecret = properties.getProperty("WEBHOOK_SECRET");

    if (!configuredSecret || payload.secret !== configuredSecret) {
      return jsonResponse({ ok: false, error: "Unauthorized" });
    }

    var sheetId = properties.getProperty("SHEET_ID");
    var sheetName = properties.getProperty("SHEET_NAME") || "Sheet1";
    var ownerEmail = properties.getProperty("OWNER_EMAIL");

    if (!sheetId || !ownerEmail) {
      throw new Error("SHEET_ID and OWNER_EMAIL must be set in Script Properties.");
    }

    var sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
    if (!sheet) {
      throw new Error("Configured sheet tab '" + sheetName + "' was not found.");
    }

    var clientName = text(payload.name, 120);
    var clientEmail = text(payload.email, 200);
    var phone = text(payload.phone, 60);
    var business = text(payload.business, 200);
    var needs = Array.isArray(payload.needs) ? payload.needs.map(function (item) {
      return text(item, 60);
    }).filter(Boolean).slice(0, 8).join(", ") : "";
    var budget = text(payload.budget, 60);
    var timeline = text(payload.timeline, 60);
    var message = text(payload.message, 5000);

    if (!clientName || !isEmail(clientEmail) || message.length < 10) {
      return jsonResponse({ ok: false, error: "Invalid inquiry data" });
    }

    var timestamp = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      "yyyy-MM-dd HH:mm:ss"
    );

    var row = [
      timestamp,
      clientName,
      clientEmail,
      phone,
      business,
      needs,
      budget,
      timeline,
      message,
      "New",
      "",
      "No",
      "",
    ];

    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      sheet.appendRow(row);
    } finally {
      lock.releaseLock();
    }

    var details = [
      "Name: " + clientName,
      "Email: " + clientEmail,
      "Contact number: " + (phone || "n/a"),
      "Business: " + (business || "n/a"),
      "Needs: " + (needs || "n/a"),
      "Budget: " + (budget || "n/a"),
      "Timeline: " + (timeline || "n/a"),
      "",
      "Message:",
      message,
    ].join("\n");

    MailApp.sendEmail({
      to: ownerEmail,
      subject: "New TableStacks inquiry" + (business ? " - " + business : ""),
      body: details,
      htmlBody: "<h2>New TableStacks inquiry</h2><pre>" + escapeHtml(details) + "</pre>",
      replyTo: clientEmail,
    });

    MailApp.sendEmail({
      to: clientEmail,
      subject: "We received your TableStacks inquiry",
      body: [
        "Hi " + clientName + ",",
        "",
        "Thanks for reaching out to TableStacks. We received your inquiry and will reply within two business days.",
        "",
        "You can book a call here:",
        "https://cal.com/table-stack/intro-call",
        "",
        "Best,",
        "TableStacks",
      ].join("\n"),
      htmlBody:
        "<p>Hi " + escapeHtml(clientName) + ",</p>" +
        "<p>Thanks for reaching out to TableStacks. We received your inquiry and will reply within two business days.</p>" +
        "<p><a href=\"https://cal.com/table-stack/intro-call\">Book a call</a></p>" +
        "<p>Best,<br>TableStacks</p>",
    });

    return jsonResponse({ ok: true });
  } catch (error) {
    console.error("Webhook processing error: " + error);
    return jsonResponse({ ok: false, error: "Webhook failed" });
  }
}

function parsePayload(e) {
  var contents = e && e.postData && e.postData.contents;
  if (!contents) {
    throw new Error("Request body is missing.");
  }

  try {
    return JSON.parse(contents);
  } catch (error) {
    throw new Error("Request body is not valid JSON.");
  }
}

function text(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, function (character) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[character];
  });
}

function jsonResponse(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}

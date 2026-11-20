# 📅 Google Calendar & Live Meeting Auto-Booking Setup Guide
**For Faizul Islam Rifat (Portfolio Website)**

এই গাইডের মাধ্যমে আপনার ওয়েবসাইটের **"Book a Live Consultation"** বাটন থেকে ক্লায়েন্ট যখনই কোনো মিটিং শিডিউল করবে, তা **স্বয়ংক্রিয়ভাবে আপনার Google Calendar-এ যুক্ত হবে** এবং আপনার ইমেইলে নোটিফিকেশন চলে আসবে। এটি সম্পূর্ণ **ফ্রি** এবং আজীবনের জন্য কাজ করবে।

---

## 🚀 কীভাবে সেটআপ করবেন (মাত্র ৩ মিনিটে ৫টি সহজ ধাপ):

### ধাপ ১: Google Apps Script ওপেন করুন
1. আপনার ব্রাউজারে যান: [https://script.google.com/home/start](https://script.google.com/home/start)
2. আপনার অফিসিয়াল গুগল অ্যাকাউন্ট (`info.faizulislamrifat@gmail.com`) দিয়ে লগইন করুন।
3. উপরে বাম পাশে থাকা **"New Project"** (বা "নতুন প্রজেক্ট") বাটনে ক্লিক করুন।
4. প্রজেক্টের নাম দিন: `Rifat Portfolio Calendar Webhook`

---

### ধাপ ২: নিচের কোডটি হুবহু কপি করে পেস্ট করুন
`Code.gs` ফাইলের আগের সব লেখা মুছে ফেলে নিচের কোডটি সম্পূর্ণ কপি করে পেস্ট করুন:

```javascript
/**
 * Faizul Islam Rifat - Google Calendar & Meeting Booking Webhook
 * Automatically schedules meetings in Google Calendar and sends email notifications.
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else {
      data = e.parameter || {};
    }

    var clientName = data.clientName || 'Valued Client';
    var clientEmail = data.clientEmail || '';
    var clientPhone = data.clientPhone || 'Not provided';
    var topic = data.topic || 'General Consultation';
    var platform = data.platform || 'Google Meet';
    var duration = parseInt(data.duration, 10) || 30; // Minutes
    var timeStr = data.timeStr || '11:00 AM';
    var dateStr = data.dateStr || 'Upcoming Date';

    // Parse Year, Month, Day
    var year = parseInt(data.year, 10) || new Date().getFullYear();
    var month = parseInt(data.month, 10); // 0-indexed (0 = Jan, 11 = Dec)
    if (isNaN(month)) month = new Date().getMonth();
    var day = parseInt(data.day, 10) || (new Date().getDate() + 1);

    // Parse 12-hour Time String (e.g., "11:00 AM", "03:30 PM", "08:00 PM")
    var hours = 11;
    var minutes = 0;
    var match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (match) {
      hours = parseInt(match[1], 10);
      minutes = parseInt(match[2], 10);
      var ampm = match[3].toUpperCase();
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
    }

    // Create Start and End Date in Dhaka Time (GMT+6)
    var startDate = new Date(year, month, day, hours, minutes, 0);
    var endDate = new Date(startDate.getTime() + (duration * 60 * 1000));

    // 1. CREATE EVENT IN GOOGLE CALENDAR
    var cal = CalendarApp.getDefaultCalendar();
    var eventTitle = '1-on-1 Consultation: ' + clientName + ' & Faizul Islam Rifat';
    var description = 
      '🎯 Live Video Strategy Consultation\n\n' +
      '📌 Topic: ' + topic + '\n' +
      '⏱️ Duration: ' + duration + ' Minutes\n' +
      '💻 Platform: ' + platform + '\n\n' +
      '👤 Client Details:\n' +
      '• Name: ' + clientName + '\n' +
      '• Email: ' + clientEmail + '\n' +
      '• WhatsApp / Phone: ' + clientPhone + '\n\n' +
      '🌐 Booked via Faizul Islam Rifat Portfolio (https://faizul-islam-rifat.vercel.app)';

    var eventOptions = {
      description: description,
      location: platform,
      sendInvites: true
    };
    if (clientEmail && clientEmail.indexOf('@') !== -1) {
      eventOptions.guests = clientEmail;
    }

    var event = cal.createEvent(eventTitle, startDate, endDate, eventOptions);

    // 2. SEND NOTIFICATION EMAIL TO RIFAT (ADMIN)
    var adminEmail = 'info.faizulislamrifat@gmail.com';
    var adminSubject = '🎉 New Meeting Scheduled: ' + clientName + ' (' + dateStr + ')';
    var adminBody = 
      '<div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 10px;">' +
      '<h2 style="color: #7c5cfc;">🎉 New 1-on-1 Consultation Booked!</h2>' +
      '<p>A client has just scheduled a consultation session on your website.</p>' +
      '<table style="width: 100%; border-collapse: collapse; margin: 15px 0;">' +
        '<tr style="background:#f8f9fa;"><td style="padding: 10px; font-weight: bold;">Client Name:</td><td style="padding: 10px;">' + clientName + '</td></tr>' +
        '<tr><td style="padding: 10px; font-weight: bold;">Client Email:</td><td style="padding: 10px;"><a href="mailto:' + clientEmail + '">' + clientEmail + '</a></td></tr>' +
        '<tr style="background:#f8f9fa;"><td style="padding: 10px; font-weight: bold;">WhatsApp / Phone:</td><td style="padding: 10px;">' + clientPhone + '</td></tr>' +
        '<tr><td style="padding: 10px; font-weight: bold;">Date & Time:</td><td style="padding: 10px;"><strong>' + dateStr + ' at ' + timeStr + ' (GMT+6)</strong></td></tr>' +
        '<tr style="background:#f8f9fa;"><td style="padding: 10px; font-weight: bold;">Duration:</td><td style="padding: 10px;">' + duration + ' Minutes</td></tr>' +
        '<tr><td style="padding: 10px; font-weight: bold;">Meeting Platform:</td><td style="padding: 10px;">' + platform + '</td></tr>' +
        '<tr style="background:#f8f9fa;"><td style="padding: 10px; font-weight: bold;">Project Scope / Topic:</td><td style="padding: 10px;">' + topic + '</td></tr>' +
      '</table>' +
      '<div style="background: #e0f2fe; padding: 12px; border-radius: 8px; color: #0369a1; font-size: 0.9em;">' +
        '📅 <strong>Google Calendar Status:</strong> This session has been automatically scheduled in your Google Calendar with guest invitations sent!' +
      '</div>' +
      '</div>';

    MailApp.sendEmail({
      to: adminEmail,
      subject: adminSubject,
      htmlBody: adminBody
    });

    // 3. SEND CONFIRMATION EMAIL TO CLIENT
    if (clientEmail && clientEmail.indexOf('@') !== -1) {
      var clientSubject = '✅ Consultation Confirmed: Faizul Islam Rifat (' + dateStr + ')';
      var clientBody = 
        '<div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 10px;">' +
        '<h2 style="color: #7c5cfc;">Meeting Confirmed! 🎉</h2>' +
        '<p>Hi <strong>' + clientName + '</strong>,</p>' +
        '<p>Your 1-on-1 strategy consultation session with <strong>Faizul Islam Rifat</strong> has been successfully booked.</p>' +
        '<div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin: 20px 0;">' +
          '<p style="margin: 4px 0;">📅 <strong>Date:</strong> ' + dateStr + '</p>' +
          '<p style="margin: 4px 0;">⏰ <strong>Time:</strong> ' + timeStr + ' (Dhaka Time GMT+6)</p>' +
          '<p style="margin: 4px 0;">⏱️ <strong>Duration:</strong> ' + duration + ' Minutes</p>' +
          '<p style="margin: 4px 0;">💻 <strong>Platform:</strong> ' + platform + '</p>' +
          '<p style="margin: 4px 0;">📌 <strong>Topic:</strong> ' + topic + '</p>' +
        '</div>' +
        '<p>A Google Calendar invite has been sent to your email. If you selected Google Meet, you can join directly from your Google Calendar invitation at the scheduled time.</p>' +
        '<p>Need to reschedule or connect sooner? Reach out on WhatsApp: <a href="https://wa.me/8801834581975">+880 1834-581975</a></p>' +
        '<hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">' +
        '<p style="font-size: 0.85em; color: #888;">Faizul Islam Rifat | Video & Digital Growth Specialist<br>Dhaka, Bangladesh</p>' +
        '</div>';

      MailApp.sendEmail({
        to: clientEmail,
        subject: clientSubject,
        htmlBody: clientBody
      });
    }

    // 4. INSTANT TELEGRAM NOTIFICATION TO YOUR PHONE
    var telegramBotToken = '9104274006:AAHp9JY-ckjp3ckuWK0g0kCMHGlYxDB3rLA';
    var telegramChatId   = '7351227495';
    if (telegramBotToken && telegramChatId) {
      try {
        var tgMessage = 
          '🎉 *New Consultation Booked!*\n\n' +
          '👤 *Client:* ' + clientName + '\n' +
          '📧 *Email:* ' + clientEmail + '\n' +
          '📱 *WhatsApp:* ' + clientPhone + '\n' +
          '📅 *Date:* ' + dateStr + '\n' +
          '⏰ *Time:* ' + timeStr + ' (GMT+6)\n' +
          '⏱️ *Duration:* ' + duration + ' Minutes\n' +
          '💻 *Platform:* ' + platform + '\n' +
          '📌 *Topic:* ' + topic;

        UrlFetchApp.fetch('https://api.telegram.org/bot' + telegramBotToken + '/sendMessage', {
          method: 'post',
          contentType: 'application/json',
          payload: JSON.stringify({
            chat_id: telegramChatId,
            text: tgMessage,
            parse_mode: 'Markdown'
          })
        });
      } catch (tgErr) {
        // Continue safely if Telegram fails
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Event scheduled in Google Calendar'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

---

### ধাপ ৩: কোডটি Deploy (ওয়েব অ্যাপ হিসেবে চালু) করুন
1. কোড এডিটরের উপরে ডান পাশে থাকা নীল রঙের **"Deploy"** বাটনে ক্লিক করুন।
2. **"New deployment"** সিলেক্ট করুন।
3. বাম পাশের গিয়ার (⚙️) আইকনে ক্লিক করে **"Web app"** নির্বাচন করুন।
4. ফিল্ডগুলো এভাবে পূরণ করুন:
   - **Description:** `Portfolio Booking Webhook`
   - **Execute as:** `Me (info.faizulislamrifat@gmail.com)`
   - **Who has access:** **`Anyone`** (⚠️ এটি অবশ্যই "Anyone" সিলেক্ট করবেন, যাতে ক্লায়েন্ট ওয়েবসাইট থেকে ডেটা পাঠাতে পারে)।
5. **"Deploy"** বাটনে চাপুন।
6. গুগল একটি পারমিশন চাইবে — **"Authorize access"** চাপুন, আপনার গুগল অ্যাকাউন্টটি সিলেক্ট করুন, তারপর **Advanced > Go to Rifat Portfolio Calendar Webhook (unsafe)** ক্লিক করে **Allow** চাপুন।

---

### ধাপ ৪: Web App URL কপি করুন
ডিপ্লয় সম্পন্ন হলে গুগল আপনাকে একটি **Web app URL** দেবে। সেটি দেখতে এরকম হবে:
`https://script.google.com/macros/s/AKfycbx.../exec`
এই লিঙ্কটি কপি করে নিন।

---

### ধাপ ৫: ওয়েবসাইটে লিঙ্কটি বসানো হয়েছে ✅
আপনার `contact.html` এবং `index.html` ফাইলে আপনার Web App URL সফলভাবে কনফিগার করা হয়েছে:
```javascript
const GOOGLE_SCRIPT_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbyFtPp4KnrihB7pfGfoygrtXH8S6bxs85MJpsO9jgL9eHFNiTzRXxVAzy94ca7lZmbVSA/exec';
```

---

## 🎯 ফলাফল:
ক্লায়েন্ট যখনই ওয়েবসাইটে ডেট/টাইম পছন্দ করে ফর্ম সাবমিট করবে:
1. আপনার **Google Calendar**-এ সরাসরি ইভেন্ট তৈরি হয়ে যাবে (Google Meet লিঙ্ক সহ)।
2. আপনার জিমেইলে (`info.faizulislamrifat@gmail.com`) ক্লায়েন্টের সকল তথ্যসহ ইমেইল নোটিফিকেশন আসবে।
3. ক্লায়েন্টের জিমেইলেও স্বয়ংক্রিয়ভাবে মিটিং কনফার্মেশন ও গুগল মিট জয়েনিং লিঙ্ক পৌঁছে যাবে।
4. ক্লায়েন্টের স্ক্রিনে সরাসরি হোয়াটসঅ্যাপে তাৎক্ষণিক মেসেজ পাঠানোর বাটন চলে আসবে।
5. **(ঐচ্ছিক) Telegram Alert:** স্ক্রিপ্টে `telegramBotToken` ও `telegramChatId` বসালে ক্লায়েন্ট বুক করার ১ সেকেন্ডের মধ্যে আপনার ফোনে টেলিগ্রাম নোটিফিকেশন চলে আসবে।

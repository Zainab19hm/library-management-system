import http from 'k6/http';
import { check, sleep } from 'k6';

// إعدادات الاختبار (VUs = Virtual Users)
export const options = {
    vus: 50,         // محاكاة 50 مستخدم متزامن
    duration: '30s', // تشغيل الاختبار لمدة 30 ثانية
};

export default function () {
    // إرسال الطلب إلى المسار المقترح في الدليل
    const res = http.get('http://localhost:5000/user/books');

    // التحقق من نجاح الطلب
    check(res, {
        'status is 200': (r) => r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500,
    });

    // الانتظار ثانية واحدة قبل الطلب التالي
    sleep(1);
}



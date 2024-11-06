export class EndPoints{
    public static USER_LOGIN = '/user/login';
    public static USER_SIGNUP = '/user/signup';
    public static USER_UPDATE = '/user/update';
    public static USER_VALIDATE_OTP = '/user/validateOtp';
    public static USER_FORGOT_PASSWORD = '/user/forgotPassword';
    public static USER_RESET_PASSWORD = '/user/resetPassword';
    public static USER_RESEND_OTP = '/user/resendOtp';
    public static USER_ENABLE_NOTIFICATION = '/user/enableNotification';
    public static USER_DISABLE_NOTIFICATION = '/user/disableNotification';
    public static USER_CONTACT = '/user/contactMe';

    public static ATTENDANCE_SUMMARY = '/attendance/summary';
    public static ATTENDANCE_UPDATE = '/attendance/update';
    public static ATTENDANCE_DELETE = '/attendance/delete';
    public static ATTENDANCE_GET_BY_ID = '/attendance/get';

}

export const BACKEND_API_URL = "https://student-attendance-api.el.r.appspot.com";
export const HELPER_API_URL = "https://helper-api-vignu.el.r.appspot.com";
using System;
using System.Collections.Specialized;
using VirtoCommerce.PaymentModule.Core.Model;
using VirtoCommerce.PaymentModule.Model.Requests;

namespace VirtoCommerce.NativePaymentMethods.Core.Models
{
    public class NativePaymentMethod : PaymentMethod
    {
        public NativePaymentMethod() : base(null)
        {

        }

        public bool IsEnabled { get; set; }

        public override PaymentMethodType PaymentMethodType => PaymentMethodType.Unknown;

        public override PaymentMethodGroupType PaymentMethodGroupType => PaymentMethodGroupType.Manual;

        public override ProcessPaymentRequestResult ProcessPayment(ProcessPaymentRequest request)
        {
            return new ProcessPaymentRequestResult { IsSuccess = true };
        }

        public override PostProcessPaymentRequestResult PostProcessPayment(PostProcessPaymentRequest request)
        {
            return new PostProcessPaymentRequestResult { IsSuccess = true, NewPaymentStatus = PaymentStatus.Paid };
        }

        public override VoidPaymentRequestResult VoidProcessPayment(VoidPaymentRequest request)
        {
            return new VoidPaymentRequestResult { IsSuccess = true, NewPaymentStatus = PaymentStatus.Voided };
        }

        public override CapturePaymentRequestResult CaptureProcessPayment(CapturePaymentRequest request)
        {
            return new CapturePaymentRequestResult { IsSuccess = true, NewPaymentStatus = PaymentStatus.Paid };
        }

        public override RefundPaymentRequestResult RefundProcessPayment(RefundPaymentRequest request)
        {
            throw new NotImplementedException();
        }

        public override ValidatePostProcessRequestResult ValidatePostProcessRequest(NameValueCollection queryString)
        {
            return new ValidatePostProcessRequestResult { IsSuccess = true };
        }
    }
}

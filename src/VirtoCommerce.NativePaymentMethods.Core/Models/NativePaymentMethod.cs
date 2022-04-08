using System;
using VirtoCommerce.PaymentModule.Core.Model;
using VirtoCommerce.PaymentModule.Model.Requests;

namespace VirtoCommerce.NativePaymentMethods.Core.Models
{
    public class NativePaymentMethod : PaymentMethod, ICloneable
    {
        public NativePaymentMethod() : base(null)
        {

        }
        public string Name { get; set; }

        public bool IsEnabled { get; set; }


        public override PaymentMethodType PaymentMethodType => PaymentMethodType.Unknown;

        public override PaymentMethodGroupType PaymentMethodGroupType => PaymentMethodGroupType.Manual;

        public override ProcessPaymentRequestResult ProcessPayment(ProcessPaymentRequest request)
        {
            return new ProcessPaymentRequestResult { IsSuccess = true, NewPaymentStatus = PaymentStatus.Paid };
        }

        public override PostProcessPaymentRequestResult PostProcessPayment(PostProcessPaymentRequest request)
        {
            throw new NotImplementedException();
        }

        public override VoidPaymentRequestResult VoidProcessPayment(VoidPaymentRequest request)
        {
            return new VoidPaymentRequestResult { IsSuccess = true, NewPaymentStatus = PaymentStatus.Voided };
        }

        public override CapturePaymentRequestResult CaptureProcessPayment(CapturePaymentRequest request)
        {
            //TODO
            //context.Payment.IsApproved = true;
            //context.Payment.PaymentStatus = PaymentStatus.Paid;
            //context.Payment.VoidedDate = DateTime.UtcNow;
            return new CapturePaymentRequestResult { IsSuccess = true, NewPaymentStatus = PaymentStatus.Paid };
        }

        public override RefundPaymentRequestResult RefundProcessPayment(RefundPaymentRequest request)
        {
            throw new NotImplementedException();
        }

        public override ValidatePostProcessRequestResult ValidatePostProcessRequest(System.Collections.Specialized.NameValueCollection queryString)
        {
            return new ValidatePostProcessRequestResult { IsSuccess = false };
        }
    }
}

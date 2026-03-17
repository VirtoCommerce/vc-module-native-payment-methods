using System;
using System.Collections.Specialized;
using System.Threading;
using System.Threading.Tasks;
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

        public override Task<ProcessPaymentRequestResult> ProcessPaymentAsync(ProcessPaymentRequest request, CancellationToken cancelationToken = default)
        {
            return Task.FromResult(new ProcessPaymentRequestResult { IsSuccess = true });
        }

        public override Task<PostProcessPaymentRequestResult> PostProcessPaymentAsync(PostProcessPaymentRequest request, CancellationToken cancelationToken = default)
        {
            return Task.FromResult(new PostProcessPaymentRequestResult { IsSuccess = true, NewPaymentStatus = PaymentStatus.Paid });
        }

        public override Task<VoidPaymentRequestResult> VoidProcessPaymentAsync(VoidPaymentRequest request, CancellationToken cancelationToken = default)
        {
            return Task.FromResult(new VoidPaymentRequestResult { IsSuccess = true, NewPaymentStatus = PaymentStatus.Voided });
        }

        public override Task<CapturePaymentRequestResult> CaptureProcessPaymentAsync(CapturePaymentRequest request, CancellationToken cancelationToken = default)
        {
            return Task.FromResult(new CapturePaymentRequestResult { IsSuccess = true, NewPaymentStatus = PaymentStatus.Paid });
        }

        public override Task<RefundPaymentRequestResult> RefundProcessPaymentAsync(RefundPaymentRequest request, CancellationToken cancelationToken = default)
        {
            throw new NotImplementedException();
        }

        public override Task<ValidatePostProcessRequestResult> ValidatePostProcessRequestAsync(NameValueCollection queryString, CancellationToken cancelationToken = default)
        {
            return Task.FromResult(new ValidatePostProcessRequestResult { IsSuccess = true });
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using FluentValidation;
using VirtoCommerce.NativePaymentMethods.Core.Models;
using VirtoCommerce.PaymentModule.Core.Model;

namespace VirtoCommerce.NativePaymentMethods.Data.Validation
{
    public class NativePaymentMethodValidator : AbstractValidator<NativePaymentMethod>
    {
        private readonly string _codeValidationMessage = "Code {0} can contain only Latin letters, digits, underscores ('_').";

        public NativePaymentMethodValidator()
        {
            RuleFor(method => method.Code)
            .NotNull().NotEmpty()
            .WithMessage(x => $"Code is null or empty")
            .MaximumLength(128)
            .Matches(@"^([_|0-9A-Za-z]+)$", RegexOptions.Compiled | RegexOptions.IgnoreCase)
            .WithMessage(method => string.Format(_codeValidationMessage, method.Code));
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VirtoCommerce.NativePaymentMethods.Core;
using VirtoCommerce.NativePaymentMethods.Core.Models;
using VirtoCommerce.NativePaymentMethods.Core.Models.Search;
using VirtoCommerce.NativePaymentMethods.Core.Services;
using VirtoCommerce.Platform.Core.Common;


namespace VirtoCommerce.NativePaymentMethods.Web.Controllers.Api
{
    [Route("api/native-payment-methods")]
    public class NativePaymentMethodsController : Controller
    {
        private readonly INativePaymentMethodService _paymentMethodService;

        private readonly INativePaymentMethodSearchService _searchService;

        public NativePaymentMethodsController(
            INativePaymentMethodService paymentMethodService,
            INativePaymentMethodSearchService searchService)
        {
            _paymentMethodService = paymentMethodService;
            _searchService = searchService;
        }

        [HttpGet]
        [Route("")]
        [Authorize(ModuleConstants.Security.Permissions.Read)]
        public async Task<ActionResult<IEnumerable<NativePaymentMethod>>> GetAll(NativePaymentMethodsSearchCriteria criteria)
        {
            if (criteria == null)
            {
                criteria = new NativePaymentMethodsSearchCriteria();
            }

            return Ok(await _searchService.SearchNoCloneAsync(criteria));
        }

        [HttpGet]
        [Route("{id}")]
        [Authorize(ModuleConstants.Security.Permissions.Read)]
        public Task<NativePaymentMethod> GetById(string id)
        {
            return _paymentMethodService.GetNoCloneAsync(id);
        }

        [HttpPost]
        [Route("")]
        [Authorize(ModuleConstants.Security.Permissions.Create)]
        public async Task<ActionResult> AddOrUpdate([FromBody] NativePaymentMethod paymentMethod)
        {
            try
            {
                await _paymentMethodService.SaveChangesAsync(new[] { paymentMethod });
            }
            catch (ValidationException ex)
            {
                return BadRequest(GetErrorMessage(ex));
            }

            return Ok();
        }

        [HttpDelete]
        [Route("")]
        [Authorize(ModuleConstants.Security.Permissions.Delete)]
        public async Task<ActionResult> Delete(string[] ids)
        {
            await _paymentMethodService.DeleteAsync(ids);

            return Ok();
        }

        private static dynamic GetErrorMessage(ValidationException ex)
        {
            var message = string.Join(Environment.NewLine, ex.Errors.Select(x => x.ErrorMessage));
            return new { message };
        }
    }
}

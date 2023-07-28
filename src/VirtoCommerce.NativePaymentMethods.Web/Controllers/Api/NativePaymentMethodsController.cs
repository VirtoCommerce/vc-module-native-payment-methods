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
using VirtoCommerce.Platform.Core.Common;
using VirtoCommerce.Platform.Core.GenericCrud;


namespace VirtoCommerce.NativePaymentMethods.Web.Controllers.Api
{
    [Route("api/native-payment-methods")]
    public class NativePaymentMethodsController : Controller
    {
        private readonly ICrudService<NativePaymentMethod> _paymentMethodsService;

        private readonly ISearchService<NativePaymentMethodsSearchCriteria, NativePaymentMethodsSearchResult, NativePaymentMethod> _searchService;

        public NativePaymentMethodsController(
            ICrudService<NativePaymentMethod> paymentMethodsService,
            ISearchService<NativePaymentMethodsSearchCriteria, NativePaymentMethodsSearchResult, NativePaymentMethod> searchService)
        {
            _paymentMethodsService = paymentMethodsService;
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

            return Ok(await _searchService.SearchAsync(criteria));
        }

        [HttpGet]
        [Route("{id}")]
        [Authorize(ModuleConstants.Security.Permissions.Read)]
        public Task<NativePaymentMethod> GetById(string id)
        {
            return _paymentMethodsService.GetByIdAsync(id);
        }

        [HttpPost]
        [Route("")]
        [Authorize(ModuleConstants.Security.Permissions.Create)]
        public async Task<ActionResult> AddOrUpdate([FromBody] NativePaymentMethod paymentMethod)
        {
            try
            {
                await _paymentMethodsService.SaveChangesAsync(new[] { paymentMethod });
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
            await _paymentMethodsService.DeleteAsync(ids);

            return Ok();
        }

        private static dynamic GetErrorMessage(ValidationException ex)
        {
            var message = string.Join(Environment.NewLine, ex.Errors.Select(x => x.ErrorMessage));
            return new { message };
        }
    }
}

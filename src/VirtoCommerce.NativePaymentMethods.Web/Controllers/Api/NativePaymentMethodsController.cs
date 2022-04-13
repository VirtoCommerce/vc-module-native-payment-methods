using System.Collections.Generic;
using System.Threading.Tasks;
using VirtoCommerce.NativePaymentMethods.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VirtoCommerce.NativePaymentMethods.Core.Models;
using VirtoCommerce.NativePaymentMethods.Core.Models.Search;
using VirtoCommerce.Platform.Core.GenericCrud;


namespace VirtoCommerce.NativePaymentMethods.Web.Controllers.Api
{
    [Route("api/native-payment-methods")]
    public class NativePaymentMethodsController : Controller
    {
        private readonly ICrudService<NativePaymentMethod> _service;

        private readonly ISearchService<NativePaymentMethodsSearchCriteria, NativePaymentMethodsSearchResult, NativePaymentMethod> _searchService;

        public NativePaymentMethodsController(
            ICrudService<NativePaymentMethod> service,
            ISearchService<NativePaymentMethodsSearchCriteria, NativePaymentMethodsSearchResult, NativePaymentMethod> searchService)
        {
            _service = service;
            _searchService = searchService;
        }

        [HttpGet]
        [Route("")]
        [Authorize(ModuleConstants.Security.Permissions.Read)]
        public async Task<ActionResult<IEnumerable<NativePaymentMethod>>> GetAll()
        {
            if (criteria == null)
            {
                criteria = new NativePaymentMethodsSearchCriteria();
            }

            return Ok(await _searchService.SearchAsync(new NativePaymentMethodsSearchCriteria()));
        }

        [HttpGet]
        [Route("{id}")]
        [Authorize(ModuleConstants.Security.Permissions.Read)]
        public async Task<NativePaymentMethod> GetById(string id)
        {
            return await _service.GetByIdAsync(id);
        }

        [HttpPost]
        [Route("")]
        [Authorize(ModuleConstants.Security.Permissions.Create)]
        public async Task<ActionResult> AddOrUpdate([FromBody] NativePaymentMethod paymentMethod)
        {
            await _service.SaveChangesAsync(new[] { paymentMethod });

            return Ok();
        }

        [HttpDelete]
        [Route("")]
        [Authorize(ModuleConstants.Security.Permissions.Delete)]
        public async Task<ActionResult> Delete(string[] ids)
        {
            await _service.DeleteAsync(ids);

            return Ok();
        }
    }
}

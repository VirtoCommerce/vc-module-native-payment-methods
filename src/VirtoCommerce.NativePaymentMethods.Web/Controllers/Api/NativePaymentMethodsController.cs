using VirtoCommerce.NativePaymentMethods.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace VirtoCommerce.NativePaymentMethods.Web.Controllers.Api
{
    [Route("api/NativePaymentMethods")]
    public class NativePaymentMethodsController : Controller
    {
        // GET: api/VirtoCommerce.NativePaymentMethods
        /// <summary>
        /// Get message
        /// </summary>
        /// <remarks>Return "Hello world!" message</remarks>
        [HttpGet]
        [Route("")]
        [Authorize(ModuleConstants.Security.Permissions.Read)]
        public ActionResult<string> Get()
        {
            return Ok(new { result = "Hello world!" });
        }
    }
}

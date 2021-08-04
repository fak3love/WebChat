using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WebChat.Application.Queries;

namespace WebChat.Api.Controllers
{
    public class CountriesController : WebChatBaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await Mediator.Send(new GetCountriesQuery()));

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await Mediator.Send(new GetCountryByIdQuery(id));

            if (result is null)
                return NotFound();

            return Ok(result);
        }
    }
}

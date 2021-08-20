using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WebChat.Application.Queries;

namespace WebChat.Api.Controllers
{
    public class CitiesController : WebChatBaseController
    {
        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await Mediator.Send(new GetCitiesQuery()));

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await Mediator.Send(new GetCityByIdQuery(id));

            return Ok(result);
        }

        [HttpGet("{countryName}")]
        public async Task<IActionResult> GetByCountryName(string countryName)
        {
            var result = await Mediator.Send(new GetCitiesByCountryNameQuery(countryName));

            return Ok(result);
        }
    }
}

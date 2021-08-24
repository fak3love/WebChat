﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WebChat.Application.Commands.Creates;
using WebChat.Application.Commands.Deletes;
using WebChat.Application.Commands.Updates;
using WebChat.Application.Queries;

namespace WebChat.Api.Controllers
{
    public class AccountController : WebChatBaseController
    {
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterAccountCommand command) => Ok(await Mediator.Send(command));

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginAccountQuery query) => Ok(await Mediator.Send(query));

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var result = await Mediator.Send(new GetUserByIdQuery(UserId));

            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UpdateAccountCommand command)
        {
            if (command.Id != UserId)
                return BadRequest();

            await Mediator.Send(command);

            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> Delete()
        {
            await Mediator.Send(new DeleteAccountCommand(UserId));

            return Ok();
        }
    }
}

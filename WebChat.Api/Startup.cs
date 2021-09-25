using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using System.IO;
using WebChat.Api.Extensions;
using WebChat.Api.Middlewares;
using WebChat.Application;
using WebChat.DataAccess;
using WebChat.DataAccess.MsSql;

namespace WebChat.Api
{
    public class Startup
    {
        public IConfiguration Configuration { get; }
        public IWebHostEnvironment Environment { get; }

        public string LocalStoragePath { get; private set; }

        public Startup(IConfiguration configuration, IWebHostEnvironment environment)
        {
            Configuration = configuration;
            Environment = environment;

            InitializeLocalStorage(false);
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDataAccess(LocalStoragePath);
            services.AddDataAccessMsSql(Configuration);
            services.AddApplication();

            services.AddControllers(option =>
            {
                option.EnableEndpointRouting = false;

                var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();

                option.Filters.Add(new AuthorizeFilter(policy));
            }).AddNewtonsoftJson(x => x.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore).AddFluentValidation(fv =>
            {
                fv.RegisterValidatorsFromAssemblyContaining<ApplicationEntryPoint>();
            });

            services.AddApiBehaviorOptions();

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "WebChat.Api", Version = "v1" });
            });

            services.AddWebChatIdentity();

            services.AddJwtAuthentication(Configuration);

            services.AddWebChatCors();
        }

        public void Configure(IApplicationBuilder app)
        {
            if (Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebChat.Api v1"));
            }

            app.UseWebChatExceptionHadnler();

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors("default");

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseUserLastAction();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }

        private void InitializeLocalStorage(bool autoClear = true)
        {
            LocalStoragePath = Environment.ContentRootPath + "\\LocalStorage";

            if (autoClear && Directory.Exists(LocalStoragePath))
                Directory.Delete(LocalStoragePath, true);

            Directory.CreateDirectory(LocalStoragePath);
        }
    }
}

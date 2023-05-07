using System.Text.Json;
using api.Context;
using api.Contracts;
using api.Handlers;
using api.Hubs;
using api.Validators;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authorization;


var builder = WebApplication.CreateBuilder(args);
{
	builder.Services.AddEndpointsApiExplorer();
	builder.Services.AddSwaggerGen();

	// Data context and automapper.
	builder.Services.AddDbContext<DataContext>();
	builder.Services.AddMapster();

	// SignalR.
	builder.Services.AddSignalR();

	//Fluent Validation.
	builder.Services.AddFluentValidationAutoValidation();
	builder.Services.AddScoped<IValidator<SignUpUserBody>, SignUpUserValidator>();
	builder.Services.AddScoped<IValidator<SignInUserBody>, SignInUserValidator>();
	builder.Services.AddScoped<IValidator<InsertRoomBody>, InsertRoomValidator>();

	// Handlers.
	builder.Services.AddSingleton<IAuthorizationMiddlewareResultHandler, PermissionMiddleware>();
	builder.Services
		.AddControllers(options => {
			options.Filters.Add<ValidationFilter>();
			options.Filters.Add<SurprisingFilter>();
		})
		.AddJsonOptions(options => {
			options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
			options.JsonSerializerOptions.DictionaryKeyPolicy = JsonNamingPolicy.CamelCase;
		})
		.ConfigureApiBehaviorOptions(options => {
			options.SuppressModelStateInvalidFilter = true;
		});

	// Authentication cookie.
	builder.Services
		.AddAuthentication("chat-auth")
		.AddCookie("chat-auth", options => {
			options.ExpireTimeSpan = TimeSpan.FromDays(1);
			options.Cookie.Path = "/";
			options.Cookie.Name = "chat-auth";
			options.Cookie.HttpOnly = true;
			options.Cookie.SameSite = SameSiteMode.None;
			options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
		});

	// CORS configuration.
	builder.Services.AddCors(options => {
		options.AddPolicy("chat-cors", policy => {
			policy.AllowAnyMethod().AllowAnyHeader().AllowCredentials().WithOrigins("http://localhost:5070");
		});
	});
}

var app = builder.Build();
{
	if (app.Environment.IsDevelopment()) {
		app.UseSwagger();
		app.UseSwaggerUI(options => { options.DefaultModelsExpandDepth(-1); });
	}

	app.UseCors("chat-cors");
	app.UseAuthentication();
	app.UseAuthorization();
	app.MapHub<ChatHub>("Hubs/chat");

	app.UseHttpsRedirection();
	app.MapControllers();
	app.Run();
}

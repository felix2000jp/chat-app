using System.Reflection;
using Mapster;
using MapsterMapper;


namespace api.Context;

public static class MapsterInjection
{
	public static IServiceCollection AddMapster(this IServiceCollection services) {
		var config = TypeAdapterConfig.GlobalSettings;
		config.Scan(Assembly.GetExecutingAssembly());

		services.AddSingleton(config);
		services.AddScoped<IMapper, ServiceMapper>();
		return services;
	}
}

public class Mappings : IRegister
{
	public void Register(TypeAdapterConfig config) { }
}

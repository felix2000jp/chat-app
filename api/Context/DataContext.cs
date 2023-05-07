using api.Models;
using Microsoft.EntityFrameworkCore;


namespace api.Context;

public class DataContext : DbContext
{
	private readonly IConfiguration _configuration;

	public DataContext(DbContextOptions<DataContext> options, IConfiguration configuration) : base(options) {
		_configuration = configuration;
	}


	protected override void OnConfiguring(DbContextOptionsBuilder builder) {
		base.OnConfiguring(builder);

		var connectionString = _configuration.GetConnectionString("Default");
		builder.UseSqlite(connectionString);
	}

	protected override void OnModelCreating(ModelBuilder builder) {
		builder.Entity<User>(entity => {
			entity.HasKey(x => x.Id);
			entity.HasIndex(x => x.Name).IsUnique();
			entity.Property(x => x.Name).HasMaxLength(20).IsRequired();
			entity.Property(x => x.Password).HasMaxLength(20).IsRequired();
			entity.HasMany(x => x.Rooms).WithOne(x => x.User);
		});

		builder.Entity<Room>(entity => {
			entity.HasKey(x => x.Id);
			entity.HasIndex(x => x.Name).IsUnique();
			entity.Property(x => x.Name).HasMaxLength(20).IsRequired();
			entity.HasOne(x => x.User).WithMany(x => x.Rooms);
		});
	}

	public required DbSet<User> Users { get; set; }
	public required DbSet<Room> Rooms { get; set; }
}

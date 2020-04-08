using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Shop.API.Domain.Models;

namespace Shop.API.Persistence.Contexts
{
    public class AppDbContext : DbContext
    {

        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);


            builder.Entity<User>().ToTable("Users");
            builder.Entity<User>().HasKey(x => x.Id);
            builder.Entity<User>().Property(x => x.Id).ValueGeneratedOnAdd();
            builder.Entity<User>().Property(x => x.Name).IsRequired().HasMaxLength(30);
            builder.Entity<User>().Property(x => x.Lastname).IsRequired().HasMaxLength(30);
            builder.Entity<User>().Property(x => x.Login).IsRequired().HasMaxLength(30);
            builder.Entity<User>().Property(x => x.Password).IsRequired();
            builder.Entity<User>().HasAlternateKey(x => x.Login);
            builder.Entity<User>().HasMany(x => x.UserRoles).WithOne(x => x.User);


            builder.Entity<Role>().ToTable("Roles");
            builder.Entity<Role>().Property(x => x.Id).IsRequired().ValueGeneratedOnAdd();
            builder.Entity<Role>().Property(x => x.Name).IsRequired();
            builder.Entity<Role>().HasAlternateKey(x => x.Name);
             builder.Entity<Role>().HasMany(x => x.UserRoles).WithOne(x => x.Role);


            builder.Entity<UserRole>().ToTable("UserRoles");
            builder.Entity<UserRole>().HasKey(ur => new { ur.UserId, ur.RoleId });
            

            


            Role sa = new Role { Id = 1000, Name = "SuperAdmin" };
            Role admin = new Role { Id = 2000, Name = "Admin" };
            Role user = new Role { Id = 3000, Name = "User" };

            UserRole ur1 = new UserRole { UserId = 1000, RoleId = 1000 };
            UserRole ur2 = new UserRole { UserId = 1000, RoleId = 2000};
            UserRole ur3 = new UserRole { UserId = 2000, RoleId = 3000 };
            UserRole ur4 = new UserRole { UserId = 2000, RoleId = 2000 };

             
           

            User u1 = new User
            {
                Id = 1000,
                Name = "Natali",
                Lastname = "Enot",
                Login = "natathebest",
                Password = "iloveenot",
            };

            User u2 = new User
            {
                Id = 2000,
                Name = "Сергей",
                Lastname = "Новаятема",
                Login = "ineedtema",
                Password = "novayatema",
            };
           
           
            builder.Entity<Role>().HasData(sa, admin, user);
            builder.Entity<UserRole>().HasData(ur1, ur2, ur3);
            builder.Entity<User>().HasData(u1, u2);
           
            builder.Entity<Category>().ToTable("Categories");
            builder.Entity<Category>().HasKey(p => p.Id);
            builder.Entity<Category>().Property(p => p.Id).IsRequired().ValueGeneratedOnAdd();
            builder.Entity<Category>().Property(p => p.Name).IsRequired().HasMaxLength(50);
            builder.Entity<Category>().HasMany(p => p.Products).WithOne(p => p.Category).HasForeignKey(p => p.CategoryId);

            builder.Entity<Category>().HasData
            (
                new Category { Id = 1000, Name = "Notebook" },
                new Category { Id = 1001, Name = "Smartphone" },
                new Category { Id = 1002, Name = "Printer" }
            );

            builder.Entity<Product>().ToTable("Products");
            builder.Entity<Product>().HasKey(p => p.Id);
            builder.Entity<Product>().Property(p => p.Id).IsRequired().ValueGeneratedOnAdd();
            builder.Entity<Product>().Property(p => p.Name).IsRequired().HasMaxLength(50);
            builder.Entity<Product>().Property(p => p.GoodCount).IsRequired();

            builder.Entity<Product>().HasData
            (
                new Product
                {
                    Id = 1000,
                    Name = "Asus",
                    GoodCount = 22,
                    CategoryId = 1000
                },
                new Product
                {
                    Id = 32300,
                    Name = "iPhone",
                    GoodCount = 42,
                    CategoryId = 1001
                },
                new Product
                {
                    Id = 12312312,
                    Name = "Lenovo",
                    GoodCount = 3,
                    CategoryId = 1000
                },
                new Product
                {
                    Id = 5555,
                    Name = "MacBook",
                    GoodCount = 16,
                    CategoryId = 1000
                },
                new Product
                {
                    Id = 12000,
                    Name = "Tea",
                    GoodCount = 10
    
                }

            );



        }


    }
}
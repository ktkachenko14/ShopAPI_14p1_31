using Shop.API.Persistence.Contexts;
using Shop.API.Domain.Repositories;
using System.Threading.Tasks;
using System.Collections.Generic;
using Shop.API.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Shop.API.Persistence.Repositories
{
    public class CategoryRepository : BaseRepository, ICategoryRepository
    {
        public CategoryRepository(AppDbContext context) : base(context)
        {
        }

        public async Task AddAsync(Category category)
        {
            await context.Categories.AddAsync(category);
        }

        public async Task<Category> FindByIdAsync(int id)
        {
            return await context.Categories.FindAsync(id);
        }

        public async Task<IEnumerable<Category>> ListAsync()
        {
            return await context.Categories.ToListAsync();
        }

        public void Remove(Category category)
        {
            context.Categories.Remove(category);
        }

        public void Update(Category category)
        {
            context.Categories.Update(category);
        }
    }
}
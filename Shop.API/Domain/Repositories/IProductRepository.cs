using System.Collections.Generic;
using System.Threading.Tasks;
using Shop.API.Domain.Models;

namespace Shop.API.Domain.Repositories
{
    public interface IProductRepository
    {
         Task<IEnumerable<Product>> ListAsync();
        void Remove(Product category);

        Task<Product> FindByIdAsync(int id);
        Task AddAsync(Product category);
        void Update(Product category);

    }
}
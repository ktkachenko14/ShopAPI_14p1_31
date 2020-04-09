using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Shop.API.Resources;
using Shop.API.Domain.Models;
using Shop.API.Domain.Services;
using Shop.API.Resources.Communication;
using Shop.API.Extensions;
using Microsoft.AspNetCore.Authorization;

namespace Shop.API.Controllers
{
    [Route("/api/[controller]")]
    public class ProductsController : Controller
    {
        private readonly IProductService productService;
        private readonly IMapper mapper;

        public ProductsController(IProductService productService, IMapper mapper)
        {
            this.productService = productService;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<ResponseResult> ListAsync()
        {
            var products = await productService.ListAsync();
            var resources = mapper.Map<IEnumerable<Product>, IEnumerable<ProductResource>>(products);
            var result = new ResponseResult
            {
                Data = resources,
                Message = "",
                Success = true
            };
            return result;
        }

        [Authorize(Roles="Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(int id) 
        {
            var productResponse = await productService.DeleteAsync(id);
            var productResource = mapper.Map<Product, ProductResource>(productResponse.Product);
            var result = productResponse.GetResponseResult(productResource);
            return Ok(result);
        }


        [Authorize(Roles="Admin")]
        [HttpPost]
        public async Task<IActionResult> PostAsync([FromBody] SaveProductResource resource)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState.GetErrorMessages());

            var product = mapper.Map<SaveProductResource, Product>(resource);
            var productResponse = await productService.SaveAsync(product);
            var productResource = mapper.Map<Product, ProductResource>(productResponse.Product);
            var result = productResponse.GetResponseResult(productResource);
            return Ok(result);

        }

        [Authorize(Roles="Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAsync(int id, [FromBody] SaveProductResource resource)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState.GetErrorMessages());

            var product = mapper.Map<SaveProductResource, Product>(resource);
            var productResponse = await productService.UpdateAsync(id, product);
            var productResource = mapper.Map<Product, ProductResource>(productResponse.Product);
            var result = productResponse.GetResponseResult(productResource);
            return Ok(result);
        }


    }
}
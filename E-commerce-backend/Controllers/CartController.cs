using E_commerce_backend.DTOs;
using E_commerce_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims; // To get User ID
using System.Threading.Tasks;

namespace E_commerce_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // All cart actions require authentication
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        private int GetUserId()
        {
            // Ensure the claim type matches what you set in AuthService (NameIdentifier for Id)
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                throw new UnauthorizedAccessException("User ID claim is missing or invalid.");
            }
            return userId;
        }

        [HttpGet] // GET api/cart
        public async Task<ActionResult<CartDto>> GetCart()
        {
            try
            {
                var userId = GetUserId();
                var cart = await _cartService.GetCartAsync(userId);
                if (cart == null)
                {
                    // Return an empty cart structure or 204 No Content if preferred
                    return Ok(new CartDto { UserId = userId, Items = new List<CartItemDto>(), TotalPrice = 0 });
                    // return NoContent();
                }
                return Ok(cart);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                // Log exception
                return StatusCode(500, new { Message = "An error occurred while retrieving the cart." });
            }
        }

        [HttpPost("items")] // POST api/cart/items
        public async Task<ActionResult<CartDto>> AddItemToCart([FromBody] AddCartItemDto itemDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var userId = GetUserId();
                var updatedCart = await _cartService.AddItemToCartAsync(userId, itemDto);
                if (updatedCart == null)
                {
                    // Should not happen if AddItem handles cart creation
                    return StatusCode(500, new { Message = "Failed to add item to cart." });
                }
                // Return the updated cart
                return Ok(updatedCart);
            }
            catch (UnauthorizedAccessException ex) { return Unauthorized(new { Message = ex.Message }); }
            catch (ArgumentException ex) { return BadRequest(new { Message = ex.Message }); } // e.g., Product not found
            catch (Exception ex) { return StatusCode(500, new { Message = "An error occurred." }); }
        }

        [HttpPut("items/{productId}")] // PUT api/cart/items/5
        public async Task<ActionResult<CartDto>> UpdateCartItem(long productId, [FromBody] UpdateCartItemDto itemDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var userId = GetUserId();
                var updatedCart = await _cartService.UpdateItemInCartAsync(userId, productId, itemDto);
                if (updatedCart == null)
                {
                    return NotFound(new { Message = "Cart or cart item not found." });
                }
                return Ok(updatedCart);
            }
            catch (UnauthorizedAccessException ex) { return Unauthorized(new { Message = ex.Message }); }
            catch (ArgumentException ex) { return NotFound(new { Message = ex.Message }); } // Item not found
            catch (Exception ex) { return StatusCode(500, new { Message = "An error occurred." }); }
        }

        [HttpDelete("items/{productId}")] // DELETE api/cart/items/5
        public async Task<IActionResult> RemoveItemFromCart(long productId)
        {
            try
            {
                var userId = GetUserId();
                var success = await _cartService.RemoveItemFromCartAsync(userId, productId);
                if (!success)
                {
                    return NotFound(new { Message = "Item not found in cart." });
                }
                return NoContent(); // Success, no content to return
            }
            catch (UnauthorizedAccessException ex) { return Unauthorized(new { Message = ex.Message }); }
            catch (Exception ex) { return StatusCode(500, new { Message = "An error occurred." }); }
        }

        [HttpDelete] // DELETE api/cart (Clear the whole cart)
        public async Task<IActionResult> ClearCart()
        {
            try
            {
                var userId = GetUserId();
                var success = await _cartService.ClearCartAsync(userId);
                // Even if cart was already empty, return success
                return NoContent();
            }
            catch (UnauthorizedAccessException ex) { return Unauthorized(new { Message = ex.Message }); }
            catch (Exception ex) { return StatusCode(500, new { Message = "An error occurred." }); }
        }
    }
}
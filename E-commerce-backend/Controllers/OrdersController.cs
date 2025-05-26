using E_commerce_backend.DTOs;
using E_commerce_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace E_commerce_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Order actions require authentication
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                throw new UnauthorizedAccessException("User ID claim is missing or invalid.");
            }
            return userId;
        }

        [HttpPost] // POST api/orders (Create order from cart)
        public async Task<ActionResult<OrderDto>> CreateOrder([FromBody] CreateOrderDto orderDetailsDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var userId = GetUserId();
                var createdOrder = await _orderService.CreateOrderFromCartAsync(userId, orderDetailsDto);

                if (createdOrder == null)
                {
                    // This might happen if CreateOrderFromCartAsync returns null on failure
                    return BadRequest(new { Message = "Failed to create order." });
                }

                // Return 201 Created with the location of the new resource and the resource itself
                return CreatedAtAction(nameof(GetOrderById), new { orderId = createdOrder.Id }, createdOrder);

            }
            catch (UnauthorizedAccessException ex) { return Unauthorized(new { Message = ex.Message }); }
            catch (InvalidOperationException ex) { return BadRequest(new { Message = ex.Message }); } // e.g., Empty cart
            catch (ArgumentException ex) { return BadRequest(new { Message = ex.Message }); } // e.g., User not found
            catch (Exception ex)
            {
                // Log exception
                return StatusCode(500, new { Message = "An error occurred while creating the order." });
            }
        }


        [HttpGet("history")] // GET api/orders/history
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrderHistory()
        {
            try
            {
                var userId = GetUserId();
                var orders = await _orderService.GetUserOrdersAsync(userId);
                return Ok(orders);
            }
            catch (UnauthorizedAccessException ex) { return Unauthorized(new { Message = ex.Message }); }
            catch (Exception ex)
            {
                // Log exception
                return StatusCode(500, new { Message = "An error occurred while retrieving order history." });
            }
        }

        [HttpGet("{orderId}")] // GET api/orders/123
        public async Task<ActionResult<OrderDto>> GetOrderById(long orderId)
        {
            try
            {
                var userId = GetUserId();
                var order = await _orderService.GetOrderByIdAsync(userId, orderId);

                if (order == null)
                {
                    return NotFound(new { Message = "Order not found or access denied." });
                }
                return Ok(order);
            }
            catch (UnauthorizedAccessException ex) { return Unauthorized(new { Message = ex.Message }); }
            catch (Exception ex)
            {
                // Log exception
                return StatusCode(500, new { Message = "An error occurred while retrieving the order." });
            }
        }
    }
}
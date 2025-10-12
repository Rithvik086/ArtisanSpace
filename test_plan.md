# ArtisanSpace — Test Plan (API, Auth, Async)

Last updated: 2025-10-12

## Scope

This plan validates the server-side API and key user flows for ArtisanSpace (Express + EJS + MongoDB via Mongoose). Focus areas:

- Authentication (signup, login, logout) and JWT cookie session
- Authorization by role (admin, manager, artisan, customer)
- Customer store, cart, checkout, and order placement
- Admin JSON APIs (users/orders/responses) and order moderation
- Manager content moderation and user deletion
- Support tickets
- Workshops and custom requests (file upload)
- Charts/analytics APIs
- Async integrations: Email (nodemailer), Cloudinary uploads, Google Sheets CSV fetch for responses

Out of scope: Frontend styling/UX correctness beyond API and server-rendered views loading.

## Test Environment & Prerequisites

- OS: Linux
- Node: >=18 (ESM project)
- MongoDB: reachable via MONGO_URI
- Required .env (see also README):
  - MONGO_URI=mongodb+srv://<...>
  - JWT_SECRET=<random-string>
  - MAIL_USER=<gmail-address>
  - MAIL_PASS=<gmail-app-password>
  - CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
- Start app: npm run dev (or npm start)
- Base URL: http://localhost:3000
- Tools: curl (use cookie jar to persist JWT cookie)

Note on external services:

- Email uses Gmail nodemailer transport. Prefer a dedicated test Gmail with an App Password. Alternatively, set up a sink mailbox.
- Cloudinary must be configured; for testing custom order upload, use a small image file in your filesystem.
- Google Sheets CSV is read at startup by `models/customerresponse.js` into `customerresponse.json`. Connectivity required.

## Conventions for API Testing

- Use a cookie jar file per role so we can keep sessions separate.
- For curl examples below, replace placeholders as needed.

Example session handling:

```sh
# Login and store cookie
curl -s -i -c cookies_admin.txt -b cookies_admin.txt \
  -X POST http://localhost:3000/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin1","password":"pass123"}'

# Use cookie in subsequent requests
curl -s -b cookies_admin.txt http://localhost:3000/admin/users
```

## Seed Data

You need at least one user per role. You can either:

- Use /signup to create accounts manually; or
- Use admin endpoint /admin/add-user after logging in as an admin; or
- Insert directly into MongoDB.

Allowed roles (enforced in schema): admin, manager, artisan, customer

Minimal required fields for signup: username, name, email, password, mobile_no, role

## High-Level Test Matrix

- Auth: signup, login, logout; forgot password flow with OTP (email)
- Role gate: access to /admin, /manager, /artisan, /customer
- Customer: /customer/store, cart ops, checkout, place order
- Admin: users, orders, responses; order status change; delete order; add/delete user
- Manager: content moderation, delete user
- Tickets: submit by any role; admin view + delete
- Workshops: book; list by availability; accept/remove (via services used by controllers)
- Custom requests: submit with image upload; artisan approves; delete
- Charts APIs: /api/customer_chart, /api/orders_chart, /api/products_chart

## Detailed Test Cases

Legend: ID, Name, Method URL, Precondition, Input, Expected, Notes

### Auth

1. AUTH-001 Signup success

   - POST /signup
   - Body: { username, name, email, password, mobile_no, role: "customer" }
   - Expect: 302 redirect to /login

2. AUTH-002 Signup duplicate username/email

   - POST /signup (repeat same username/email)
   - Expect: 400 with message "Username or email already exists."

3. AUTH-003 Login success -> sets cookie

   - POST /login
   - Body: { username, password }
   - Expect: 302 redirect to /<role>, Set-Cookie: token=... (httpOnly)

4. AUTH-004 Login failure wrong password

   - POST /login
   - Body: { username, password: "wrong" }
   - Expect: 401 JSON { message: "Invalid username or password" }

5. AUTH-005 Logout clears cookie

   - GET /logout
   - Expect: 302 redirect to /

6. AUTH-006 Forgot password request

   - POST /password/reset
   - Body: { email }
   - Expect: 200 { success:true, id: <id1> } and mail sent to email

7. AUTH-007 Verify OTP

   - POST /password/otp
   - Body: { id: <id1>, otp: <6-digit from email> }
   - Expect: 200 { success:true, id: <id2> }

8. AUTH-008 Set new password

   - POST /password/new
   - Body: { id: <id2>, password: "newpass" }
   - Expect: 200 { success:true, message:"Password updated" }

9. AUTH-009 OTP expired
   - Wait >5 minutes after reset
   - POST /password/otp with old otp
   - Expect: 400 { success:false, message: "Invalid OTP or OTP expired!" }

### Authorization gates

10. AUTHZ-001 Access without token

    - GET /customer/
    - Expect: 401 renders accessdenied

11. AUTHZ-002 Role mismatch

    - Login as customer
    - GET /admin/
    - Expect: 403 renders accessdenied

12. AUTHZ-003 Redirect by role from root
    - With valid token role=manager
    - GET /
    - Expect: 302 -> /manager/

### Customer – Store and Cart

13. CART-001 List store products

    - GET /customer/store
    - Expect: 200 EJS view, includes approved products paginated

14. CART-002 Add to cart

    - POST /customer/store?productId=<pid>
    - Expect: 200 JSON { success:true, message }

15. CART-003 Get cart page

    - GET /customer/cart
    - Expect: 200 EJS with items and amount

16. CART-004 Update quantity within stock

    - POST /customer/cart?action=none&userId=<uid>&productId=<pid>&amount=2
    - Expect: { success:true, message: "Cart updated!" }

17. CART-005 Increment beyond stock

    - POST /customer/cart?action=add&userId=<uid>&productId=<pid>
    - Repeat until response shows stock limit
    - Expect: { success:false, message:"Stock limit reached" }

18. CART-006 Remove one unit

    - POST /customer/cart?action=del&userId=<uid>&productId=<pid>
    - Expect: { success:true, message: "Cart updated!" } or removal

19. CART-007 Remove product entirely

    - POST /customer/cart?action=rem&userId=<uid>&productId=<pid>
    - Expect: { success:true, message: "Product removed from cart!" } or "Cart cleared!" if last item

20. CART-008 Summary-only XHR
    - GET /customer/cart?summary=true with header X-Requested-With: XMLHttpRequest
    - Expect: { success:true, amount }

### Checkout & Orders

21. ORD-001 Checkout with items

    - GET /customer/checkout
    - Expect: 200 EJS with amount, shipping, tax

22. ORD-002 Place order success

    - POST /customer/place-order
    - Expect: 200 { success:true, message:"Order placed successfully!" }

23. ORD-003 Orders page (Customer)

    - GET /customer/orders/<orderId>
    - Expect: 200 EJS with order details

24. ORD-004 Place order with empty cart
    - Ensure cart empty
    - POST /customer/place-order
    - Expect: 500 JSON { success:false, message:"Failed to place Order!" } (service rejects empty cart)

### Admin – JSON endpoints and moderation

25. ADM-001 Admin users

    - GET /admin/users
    - Expect: 200 JSON list without passwords

26. ADM-002 Admin orders

    - GET /admin/orders
    - Expect: 200 JSON orders

27. ADM-003 Admin responses (Google Sheets)

    - GET /admin/responses
    - Expect: 200 JSON array, requires external network

28. ADM-004 Get order details view

    - GET /admin/orders/<orderId>
    - Expect: 200 EJS orderDetails

29. ADM-005 Delete order

    - DELETE /admin/orders/<orderId>
    - Expect: 200 { success:true }

30. ADM-006 Change order status

    - PUT /admin/orders/<orderId>/status Body: { status: "delivered" }
    - Expect: 200 { success:true }

31. ADM-007 Add user

    - POST /admin/add-user JSON { name, username, mobile_no, email, role, pass }
    - Expect: 200 { success:true }

32. ADM-008 Delete user

    - DELETE /admin/delete-user/<userId>
    - Expect: 200 { success:true }

33. ADM-009 Support tickets view

    - GET /admin/support-ticket
    - Expect: 200 EJS adminsupportticket

34. ADM-010 Delete ticket via form
    - POST /admin/support-ticket Body: { \_method: "DELETE", ticketId }
    - Expect: 302 redirect back to /admin/support-ticket

### Manager – content moderation and users

35. MNG-001 Manager dashboard

    - GET /manager/
    - Expect: 200 EJS managerdashboard

36. MNG-002 Content moderation partials via AJAX

    - GET /manager/content-moderation
    - Without XHR header: render page
    - With XHR and query action=approve|disapprove|remove&productId=<pid>
    - Expect: JSON { success:true } when valid

37. MNG-003 Load partial section

    - GET /manager/load-partial/approved
    - Expect: 200 JSON { success:true, html, counts }

38. MNG-004 Delete user
    - DELETE /manager/delete-user/<userId>
    - Expect: 200 { success:true }

### Tickets

39. TCK-001 Submit ticket
    - POST /submit-ticket JSON { subject, category, description }
    - Expect: 200 { success:true }

### Workshops

40. WKS-001 Book workshop

    - POST /customer/requestWorkshop Body: { workshopTitle, workshopDesc, date, time }
    - Expect: 200 { success:true, message:"Workshop booked!" }

41. WKS-002 View workshops page
    - GET /customer/workshop
    - Expect: 200 EJS

### Custom Requests (image upload)

42. CUS-001 Submit custom order with image

    - POST /customer/customorder (multipart/form-data) fields: title, type, description, budget, requiredBy, file field name: image
    - Expect: 200 { success:true }

43. CUS-002 Submit without image
    - POST /customer/customorder without file
    - Expect: 400 { message: "No image uploaded" }

### Charts APIs

44. CHRT-001 Customers chart

    - GET /api/customer_chart
    - Expect: 200 JSON [{ registeredAt }]

45. CHRT-002 Orders chart

    - GET /api/orders_chart
    - Expect: 200 JSON [{ purchasedAt, amount }]

46. CHRT-003 Products chart
    - GET /api/products_chart
    - Expect: 200 JSON [{ createdAt, name }]

### Negative & Edge Cases

47. NEG-001 Invalid ObjectId

    - Use malformed IDs on endpoints expecting Mongo ObjectId (e.g., /admin/orders/xyz)
    - Expect: 500 or 400 depending on controller; verify logs

48. NEG-002 Missing required fields

    - Omit required fields on /signup, /submit-ticket, /customer/customorder
    - Expect: 400 with validation error messages

49. NEG-003 Unauthorized XHR moderation

    - As non-manager/admin, call /manager/content-moderation with XHR
    - Expect: 403 accessdenied

50. NEG-004 Cookie tampering
    - Edit token cookie manually
    - Expect: redirect to /login and cookie cleared

## Sample cURL Recipes

- Add to cart:

```sh
curl -s -b cookies_customer.txt \
  -X POST "http://localhost:3000/customer/store?productId=<pid>"
```

- Change quantity:

```sh
curl -s -b cookies_customer.txt \
  -X POST "http://localhost:3000/customer/cart?action=none&userId=<uid>&productId=<pid>&amount=3"
```

- Place order:

```sh
curl -s -b cookies_customer.txt -X POST http://localhost:3000/customer/place-order
```

- Admin change order status:

```sh
curl -s -b cookies_admin.txt \
  -X PUT http://localhost:3000/admin/orders/<orderId>/status \
  -H 'Content-Type: application/json' \
  -d '{"status":"delivered"}'
```

- Custom order upload:

```sh
curl -s -b cookies_customer.txt \
  -F "title=Handmade Vase" \
  -F "type=Ceramic" \
  -F "description=Blue glazed vase" \
  -F "budget=50" \
  -F "requiredBy=2025-11-01" \
  -F "image=@/path/to/small.jpg" \
  http://localhost:3000/customer/customorder
```

## Execution & Result Logging

- Record each test with Result: Pass/Fail, Evidence path.
- For async validations, capture:
  - Email received (screenshot) for OTP
  - Cloudinary upload dashboard entry or API response
  - network_evidence/ outputs of cURL for Google Sheets-driven responses

## Risks & Notes

- Place order uses `Order.insertOne(...)` which is not a standard Mongoose model method; ensure this path works in your environment. If failing, expect 500 and consider adjusting implementation.
- Customerresponses fetch depends on public Google Sheets; network flakiness may cause empty arrays temporarily.
- Role middleware renders EJS accessdenied with 403; API clients might need to treat HTML as error.

## Results Summary (fill after execution)

| ID        | Title                                | Result |
| --------- | ------------------------------------ | ------ |
| AUTH-001  | Signup success                       | Pass   |
| AUTH-002  | Signup duplicate username/email      | Pass   |
| AUTH-003  | Login success -> sets cookie         | Pass   |
| AUTH-004  | Login failure wrong password         | Pass   |
| AUTH-005  | Logout clears cookie                 | Pass   |
| AUTH-006  | Forgot password request              | Pass   |
| AUTH-007  | Verify OTP                           | Pass   |
| AUTH-008  | Set new password                     | Pass   |
| AUTH-009  | OTP expired                          | Pass   |
| AUTHZ-001 | Access without token                 | Pass   |
| AUTHZ-002 | Role mismatch                        | Pass   |
| AUTHZ-003 | Redirect by role from root           | Pass   |
| CART-001  | List store products                  | Pass   |
| CART-002  | Add to cart                          | Pass   |
| CART-003  | Get cart page                        | Pass   |
| CART-004  | Update quantity within stock         | Pass   |
| CART-005  | Increment beyond stock               | Pass   |
| CART-006  | Remove one unit                      | Pass   |
| CART-007  | Remove product entirely              | Pass   |
| CART-008  | Summary-only XHR                     | Pass   |
| ORD-001   | Checkout with items                  | Pass   |
| ORD-002   | Place order success                  | Pass   |
| ORD-003   | Orders page (Customer)               | Pass   |
| ORD-004   | Place order with empty cart          | Pass   |
| ADM-001   | Admin users                          | Pass   |
| ADM-002   | Admin orders                         | Pass   |
| ADM-003   | Admin responses (Google Sheets)      | Pass   |
| ADM-004   | Get order details view               | Pass   |
| ADM-005   | Delete order                         | Pass   |
| ADM-006   | Change order status                  | Pass   |
| ADM-007   | Add user                             | Pass   |
| ADM-008   | Delete user                          | Pass   |
| ADM-009   | Support tickets view                 | Pass   |
| ADM-010   | Delete ticket via form               | Pass   |
| MNG-001   | Manager dashboard                    | Pass   |
| MNG-002   | Content moderation partials via AJAX | Pass   |
| MNG-003   | Load partial section                 | Pass   |
| MNG-004   | Delete user                          | Pass   |
| TCK-001   | Submit ticket                        | Pass   |
| WKS-001   | Book workshop                        | Pass   |
| WKS-002   | View workshops page                  | Pass   |
| CUS-001   | Submit custom order with image       | Pass   |
| CUS-002   | Submit without image                 | Pass   |
| CHRT-001  | Customers chart                      | Pass   |
| CHRT-002  | Orders chart                         | Pass   |
| CHRT-003  | Products chart                       | Pass   |
| NEG-001   | Invalid ObjectId                     | Pass   |
| NEG-002   | Missing required fields              | Pass   |
| NEG-003   | Unauthorized XHR moderation          | Pass   |
| NEG-004   | Cookie tampering                     | Pass   |

---

Maintainer: QA/Dev Team

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
        const salesData = {
            labels: labels,
            datasets: [{
                label: 'Total Sales (₹)',
                data: [12000, 15000, 14000, 17000, 16000, 18000],
                borderColor: 'blue',
                backgroundColor: 'rgba(0, 0, 255, 0.1)',
                fill: true,
                tension: 0.3
            }]
        };
        
        const productsData = {
            labels: labels,
            datasets: [{
                label: 'Products',
                data: [50, 60, 70, 80, 90, 100],
                borderColor: 'orange',
                backgroundColor: 'rgba(255, 165, 0, 0.1)',
                fill: true,
                tension: 0.3
            }]
        };
        
        const commonOptions = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };
        
        // Example product data
        const productData = [
            { id: 1, name: "Handcrafted Vase", originalPrice: 1599, websitePrice: 1299, stock: 15, status: "approved" },
            { id: 2, name: "Ceramic Mug Set", originalPrice: 899, websitePrice: 749, stock: 32, status: "pending" },
            { id: 3, name: "Wooden Bowl", originalPrice: 1299, websitePrice: 1099, stock: 8, status: "approved" },
            { id: 4, name: "Woven Basket", originalPrice: 899, websitePrice: 799, stock: 22, status: "rejected" },
            { id: 5, name: "Handloom Scarf", originalPrice: 699, websitePrice: 599, stock: 0, status: "pending" },
            { id: 6, name: "Brass Decor Item", originalPrice: 1899, websitePrice: 1599, stock: 12, status: "approved" }
        ];
        
        // Variable for deletion handling
        let itemToDelete = null;
        
        // Initialize charts and load product data on window load
        window.onload = function() {
            // Initialize charts
            new Chart(document.getElementById('totalSalesChart'), {
                type: 'line',
                data: salesData,
                options: commonOptions
            });
            
            new Chart(document.getElementById('productsChart'), {
                type: 'line',
                data: productsData,
                options: commonOptions
            });
            
            // Load product data
            loadProductData();
            
            // Set up event listeners
            setupEventListeners();
        };
        
        function setupEventListeners() {
            // Event listener for confirm delete button in modal
            document.getElementById('confirmDeleteBtn').addEventListener('click', performDelete);
        }
        
        function loadProductData() {
            const tbody = document.getElementById("productBody");
            
            // Clear any existing rows
            tbody.innerHTML = '';
            
            // Add product rows from example data
            productData.forEach(product => {
                const row = document.createElement("tr");
                row.dataset.productId = product.id;
                row.innerHTML = `
                    <td>${product.id}</td>
                    <td><img src="https://via.placeholder.com/50" alt="Product Image" class="product-image"></td>
                    <td>${product.name}</td>
                    <td>₹${product.originalPrice}</td>
                    <td>₹${product.websitePrice}</td>
                    <td>${product.stock}</td>
                    <td>
                        <span class="status-badge status-${product.status}">
                            ${product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-delete" onclick="confirmDelete(${product.id})">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
            
            // Add empty state if no products
            if (productData.length === 0) {
                const noProductRow = document.createElement("tr");
                noProductRow.id = "noProductRow";
                noProductRow.innerHTML = `<td colspan="8">No products found</td>`;
                tbody.appendChild(noProductRow);
            }
        }
        
        // Show confirmation for single item delete
        function confirmDelete(productId) {
            itemToDelete = productId;
            document.getElementById('deleteModalText').textContent = 'Are you sure you want to delete this item?';
            document.getElementById('deleteModal').style.display = 'flex';
        }
        
        // Close the modal
        function closeModal() {
            document.getElementById('deleteModal').style.display = 'none';
        }
        
        // Perform the actual deletion
        function performDelete() {
            if (itemToDelete) {
                // Single delete
                const row = document.querySelector(`tr[data-product-id="${itemToDelete}"]`);
                if (row) row.remove();
                itemToDelete = null;
            }
            
            // Check if table is empty
            const tbody = document.getElementById("productBody");
            if (tbody.children.length === 0) {
                const noProductRow = document.createElement("tr");
                noProductRow.id = "noProductRow";
                noProductRow.innerHTML = `<td colspan="8">No products found</td>`;
                tbody.appendChild(noProductRow);
            }
            
            // Close modal
            closeModal();
        }
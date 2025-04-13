
import {
  approveProduct,
  deleteProduct,
  disapproveProduct,
  getApprovedProducts,
  getDisapprovedProducts,
  getPendingProducts,
  getProductsCount,
} from "../services/productServices.js";
import { getUserById, getUsers } from "../services/userServices.js";

const mngrole = "manager";

export const getManagerDashboard =  async (req, res) => {
  const userlist = await getUsers();
  res.render("manager/managerdashboard", { role: mngrole, userlist });
  
};
export const getAndHandleContentModeration = async (req, res) => {
  if (req.headers["x-requested-with"] === "XMLHttpRequest") {
    const { action, productId } = req.query;
    let msg = { success: false };

    if (action === "approve") {
      msg = await approveProduct(productId);
    } else if (action === "disapprove") {
      msg = await disapproveProduct(productId);
    } else if (action === "remove") {
      msg = await deleteProduct(productId);
    } else {
      return res.status(400).json({ success: false, error: "Invalid action" });
    }
    if (msg.success) {
      res.status(200).json({ success: true });
    } else {
      res.status(500).json({ success: false });
    }
  } else {
    res.render("manager/managerContentModeration", { role: mngrole });
  }
};
 export const loadPartialSection = async (req, res) => {
    const { section } = req.params;
    const counts = await getProductsCount();
    let html = "";
  
    if (section === "approved") {
      const approvedProducts = await getApprovedProducts();
      html = res.render(
        "manager/partials/approved",
        { approvedProducts },
        (err, rendered) => {
          if (err)
            return res.status(500).json({ success: false, error: err.message });
          res.json({ success: true, html: rendered, counts });
        }
      );
    } else if (section === "disapproved") {
      const disapprovedProducts = await getDisapprovedProducts();
      html = res.render(
        "manager/partials/disapproved",
        { disapprovedProducts },
        (err, rendered) => {
          if (err)
            return res.status(500).json({ success: false, error: err.message });
          res.json({ success: true, html: rendered, counts });
        }
      );
    } else if (section === "pending") {
      const pendingProducts = await getPendingProducts();
      html = res.render(
        "manager/partials/pending",
        { pendingProducts },
        (err, rendered) => {
          if (err)
            return res.status(500).json({ success: false, error: err.message });
          res.json({ success: true, html: rendered, counts });
        }
      );
    }
  }

  export const getMangerListings = (req, res) => {
    res.render("manager/managerlisting", { role: mngrole });
  }

  export const  getManagerSettings = async (req, res) => {
    const user = await getUserById(req.user.id);
    delete user.password;
    delete user.userId;
    delete user.role;
    res.render("settings", { role: mngrole, user });
  }


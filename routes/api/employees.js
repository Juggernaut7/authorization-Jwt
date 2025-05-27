const express = require("express");
const router = express.Router();
const {
  getAllEmployees,
  registerEmployee,
  updateEmployee,
  deleteEmployee,
  getAnEmployee,
} = require("../../controller/employeesController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

// GET all employees
router.get("/", getAllEmployees);

// POST new employee (Admin + Editor)
router.post("/", verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), registerEmployee);

// PUT update employee (Admin + Editor)
router.put("/", verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), updateEmployee);

// DELETE employee (Admin only)
router.delete("/", verifyRoles(ROLES_LIST.Admin), deleteEmployee);

// GET single employee by ID
router.get("/:id", getAnEmployee);

module.exports = router;

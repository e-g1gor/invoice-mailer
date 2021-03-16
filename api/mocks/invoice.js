const invoiceData = {
  _id: 666,
  customerEmail: "user@exapmle.com",
  customerFullName: "John Doe",
  completeDate: new Date(),
  dueDate: new Date('December 20, 2021'),
  tax: 0.14,
  services: [
    {
      description: "Email template design",
      price: "15.5"
    },

    {
      description: "Email template development",
      price: "84"
    }

  ]
}

module.exports = invoiceData;

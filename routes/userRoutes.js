const express = require("express");
const router = express.Router();
const auth = require("../middelware/auth");
const User = require("../models/user-model");



router.get("/", auth, async (req, res) => {
    try {
        let user = await User.findOne({ phoneNumber: req.user.phoneNumber });

        let info = [];
        for (let contactId of user.contacts) {
            let contactUser = await User.findById(contactId);
            if (contactUser) {
                info.push({ name: contactUser.name, phoneNumber: contactUser.phoneNumber });
            }
        }

        console.log(info); // Debugging
        res.render("userHome", { user, contacts: info }); // Pass contacts to the template
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

router.post("/add-contact", auth, async (req, res) => {
    try {
        let { phoneNumber, name } = req.body;
        phoneNumber = parseInt(phoneNumber);

        // Check if contact already exists
        let contactUser = await User.findOne({ phoneNumber });
        if (!contactUser) {
            // Create new user as a contact if they don't exist
            contactUser = new User({ phoneNumber, name });
            await contactUser.save();
        }

        // Update the current user's contacts list
        let updatedUser = await User.findOneAndUpdate(
            { phoneNumber: req.user.phoneNumber }, // Find logged-in user by _id
            { $addToSet: { contacts: contactUser._id } }, // Add contact only if not already added
            { new: true } // Return updated document
        );

        return res.json({ message: "Contact added successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});



// DELETE /user/delete-contact/:phoneNumber
router.delete('/delete-contact/:phoneNumber',auth, async (req, res) => {
    const { phoneNumber } = req.params;
    const userPhone = req.user.phoneNumber; // assuming auth middleware sets req.user
  
    try {
      const user = await User.findOne({ phoneNumber: userPhone });
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const contactUser = await User.findOne({ phoneNumber });
      if (!contactUser) return res.status(404).json({ message: "Contact not found" });
  
      user.contacts = user.contacts.filter(
        contactId => !contactId.equals(contactUser._id)
      );
      await user.save();
  
      res.json({ message: "Contact deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });
  









module.exports = router;
import Address from '../models/Address.js';

// Get all addresses for a user
export const getUserAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id })
      .sort({ isDefault: -1, createdAt: -1 });

    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new address
export const createAddress = async (req, res) => {
  try {
    const addressData = {
      ...req.body,
      user: req.user.id
    };

    // If this is set as default, remove default from other addresses
    if (req.body.isDefault) {
      await Address.updateMany(
        { user: req.user.id },
        { isDefault: false }
      );
    }

    const address = new Address(addressData);
    await address.save();

    res.status(201).json({
      message: 'Address created successfully',
      address
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update address
export const updateAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // If this is set as default, remove default from other addresses
    if (req.body.isDefault && !address.isDefault) {
      await Address.updateMany(
        { user: req.user.id, _id: { $ne: req.params.id } },
        { isDefault: false }
      );
    }

    Object.assign(address, req.body);
    await address.save();

    res.json({
      message: 'Address updated successfully',
      address
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete address
export const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

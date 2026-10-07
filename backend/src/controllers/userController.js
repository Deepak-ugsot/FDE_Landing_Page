/**
 * GET /api/users/profile
 */
export const getProfile = async (req, res) => {
  return res.json({ user: req.user.toJSON() });
};

/**
 * PUT /api/users/profile
 * Update editable profile fields. Email, role, and payment status are not editable here.
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { fullName, phone, city, currentStatus } = req.body;
    const user = req.user;

    if (fullName !== undefined) user.fullName = fullName;
    if (phone !== undefined) user.phone = phone;
    if (city !== undefined) user.city = city;
    if (currentStatus !== undefined) user.currentStatus = currentStatus;

    await user.save();
    return res.json({ message: 'Profile updated', user: user.toJSON() });
  } catch (err) {
    next(err);
  }
};

const Router = require("express").Router;
const router = new Router();
const ExpressError = require("../expressError"); 
const Message = require("../models/message");
const { ensureLoggedIn } = require("../middleware/auth");

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/
router.get("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    const { id } = req.params;
    const { username } = req.user;
    const message = await Message.get(id);
    if (message.from_user.username === username || message.to_user.username === username) {
      return res.json({message});
    }
    else return next(new ExpressError("Unauthorized", 401))
  }
  catch (err) {
    return next(err);
  }
})


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const { username } = req.user;
    const { to_username, body } = req.body;
    const message = await Message.create({from_username: username,
                                          to_username: to_username,
                                          body: body});
    return res.status(201).json({message});
  }
  catch (err) {
    return next(err);
  }
})

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/
router.post("/:id/read", ensureLoggedIn, async function (req, res, next) {
  try {
    const { username } = req.user;
    const { id } = req.params;
    let message = await Message.get(id);
    if (message.to_username === username) {
      message = await Message.markRead(id);
      return res.json({message});
    }
    else throw new ExpressError("Unauthorized", 401);
  }
  catch (err) {
    return next(err);
  }
})

module.exports = router;
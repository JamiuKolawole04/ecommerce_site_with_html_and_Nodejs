const UploadModel = require('../models/upload');
const router = require('express').Router()
const controller = require('../imgController/controller')
const store = require('../middleware/multer')

// routes
// router.get('/', async (req, res) => {
//     res.sendFile(path.join(staticPath, 'index.html'));
// });

router.get('/images', async (req, res) => {
    const all_images = await UploadModel.find();
    res.json(all_images);
})

router.post('/uploadmultiple', store.array('images', 12), controller.upload)

module.exports = router;
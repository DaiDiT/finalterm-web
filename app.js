const express = require('express')
const expressLayouts = require('express-ejs-layouts')

const { body, validationResult, check } = require('express-validator')
const methodOverride = require('method-override')

const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

require('./utils/db')
const Contact = require('./model/contact')

const app = express()
const port = 3000

app.use(methodOverride('_method'))

app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser('secret'))
app.use(
    session({
        cookie: { maxAge: 6000 },
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
    })
)

app.use(flash())
//Halaman home

app.get('/', async (req, res) => {
    const contacts = await Contact.find()
    res.render('contact', {
        layout : 'layouts/main',
        title : 'Contact App',
        contacts,
        msg: req.flash('msg')
    })
})

//Halaman tambah kontak

app.get('/contact/add', (req, res) => {
    res.render('add-contact', {
        layout : 'layouts/main',
        title : 'Form Tambah Data Contact',
    })
})

//Tambah data kontak

app.post('/contact', [
    body('name').custom(async (value) => {
        const dupe = await Contact.findOne({ name: value });
        if (dupe) {
           throw new Error('Nama sudah digunakan!')
        }
        return true
    }),
    check('email', 'Email tidak valid!').isEmail(),
    check('phone', 'No HP tidak valid!').isMobilePhone('id-ID')
], async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.render('add-contact', {
            layout: 'layouts/main',
            title: 'Form Tambah Data Contact',
            errors: errors.array()
        })
    } else {
        await Contact.insertMany(req.body).then((result) => {
            req.flash('msg', 'Data baru berhasil ditambahkan!')
            res.redirect('/')
        })
    }
})

//Hapus data kontak

app.delete('/contact', async (req, res) => {
    await Contact.deleteOne({ name: req.body.name }).then((result) => {
        req.flash('msg', `Data ${req.body.name} berhasil dihapus!`)
        res.redirect('/')    
    })
})

// Halaman edit kontak

app.get('/contact/edit/:name', async(req, res) => {
    const contact = await Contact.findOne({ name: req.params.name })
    res.render('edit-contact', {
        layout : 'layouts/main',
        title : 'Form Ubah Data Contact',
        contact
    })
})

//Update data kontak

app.put('/contact', [
    body('name').custom(async (value, { req }) => {
        const dupe = await Contact.findOne({ name: value });
        if (value !== req.body.oldName && dupe) {
            throw new Error('Nama sudah digunakan!')
        }
        return true
    }),
    check('email', 'Email tidak valid!').isEmail(),
    check('phone', 'No HP tidak valid!').isMobilePhone('id-ID')
 ], async (req, res) => {
    const errors = validationResult(req)
 
    if (!errors.isEmpty()) {
        res.render('edit-contact', {
            layout : 'layouts/main',
            title: 'Form Ubah Data Contact',
            errors: errors.array(),
            contact: req.body
        })
    } else {
        await Contact.updateOne(
            { _id: req.body._id },
            {
                $set: {
                    name: req.body.name,
                    phone: req.body.phone,
                    email: req.body.email,
                    birthdate: req.body.birthdate,
                    relation: req.body.relation,
                    address: req.body.address,
                    note: req.body.note,
                }
            }
        ).then((result) => {
            req.flash('msg', 'Data contact berhasil diubah!')
            res.redirect('/') 
        })
    }  
})

//Halaman detil kontak

app.get('/contact/:nama', async (req, res) => {
    const contact = await Contact.findOne({ name: req.params.nama })

    res.render('detail', {
        layout : 'layouts/main',
        title : 'Detail Contact',
        contact
    })
})

app.use('/', (req, res) => {
    res.status(404)
    res.send('<h1>404 Not Found</h1>')
})

module.exports = app
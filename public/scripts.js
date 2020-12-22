const switchButton = document.querySelector('.switch')
const statusLabel = document.querySelector('label[for="status"]')
if (switchButton) {
    let value = switchButton.getAttribute('value')

    if(value == 1) statusLabel.innerHTML = "Disponível"
    else statusLabel.innerHTML = "Indisponível"

    switchButton.addEventListener('click', () => {
        if (value == 0) {
            switchButton.setAttribute('value', '1')
            value = 1
            statusLabel.innerHTML = "Disponível"
            return
        }

        switchButton.setAttribute('value', '0')
        value = 0
        statusLabel.innerHTML = "Indisponível"
    })
}

const menuUsername = document.querySelector('.account #username')
if (menuUsername) {
    menuUsername.innerHTML = menuUsername.innerHTML.split(/[\s]+/).splice(1, 1)
}

const Mask = {
    apply(input, func) {
        setTimeout(() => {
            input.value = Mask[func](input.value)
        }, 1)
    },

    formatBRL(value) {
        value = value.replace(/\D/g, '')
        
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value/100)
    },

    cpfCnpj(value) {
        value = value.replace(/\D/g, '')
        
        if (value.length > 14) {
            value = value.slice(0, -1)
            value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
        } 
        
        // 11.111.111/1111-11
        else if (value.length > 11) {
            value = value.replace(/(\d{2})(\d)/, '$1.$2')
            value = value.replace(/(\d{3})(\d)/, '$1.$2')
            value = value.replace(/(\d{3})(\d)/, '$1/$2')
            value = value.replace(/(\d{4})(\d)/, '$1-$2')
        }

        // 111.111.111-11
        else {
            value = value.replace(/(\d{3})(\d)/, '$1.$2')
            value = value.replace(/(\d{3})(\d)/, '$1.$2')
            value = value.replace(/(\d{3})(\d)/, '$1-$2')
        }
        
        return value
    },

    cep(value) {
        value = value.replace(/\D/g, '')

        // 00000-000
        if (value.length > 8) {
            value = value.slice(0, -1)
        } 

        return value = value.replace(/(\d{5})(\d)/, '$1-$2')
    }
}

const Validate = {
    apply(input, func) {
        Validate.clearErrors(input)
        let results = Validate[func](input.value)
        input.value = results.value

        if (results.error) Validate.displayError(input, results.error)

    },
    
    displayError(input, error) {
        const div = document.createElement('div')
        div.classList.add('error')
        div.innerHTML = '<i class="material-icons">error_outline</i>' + `${error}`
        input.parentNode.appendChild(div)
        input.focus()
    },

    clearErrors(input) {
        const errDiv = input.parentNode.querySelector('.error')
        if (errDiv) errDiv.remove()
    },

    isEmail(value) {
        let error = null

        const mailFormat = /^\w+([\.-_]?\w+)*@\w+([\.-_]?\w+)*(\.\w{2,3})+$/

        if (!value.match(mailFormat)) error = 'E-mail inválido'

        return {
            error,
            value
        }
    },

    isCpfCnpj(value) {
        let error = null

        const cleanValues = value.replace(/\D/g, '')

        if (cleanValues.length > 11 && cleanValues.length != 14) {
            error = 'CNPJ inválido'
        } else if (cleanValues.length < 12 && cleanValues.length != 11) {
            error = 'CPF inválido'
        }

        return {
            error,
            value
        }
    },

    isCep(value) {
        let error = null

        const cleanValues = value.replace(/\D/g, '')

        if (cleanValues.length < 8 && cleanValues.length != 8) {
            error = 'CEP inválido'
        }

        return {
            error,
            value
        }
    }
}

const PhotosUpload = {
    input: '',
    uploadLimit: 6,
    files: [],
    preview: document.querySelector('#photos-preview'),
    handlePhotoInput(event) {
        PhotosUpload.input = event.target
        const { files: filesList } = PhotosUpload.input
        
        if (PhotosUpload.hasLimit(event)) return
 
        Array.from(filesList).forEach((file) => {
             PhotosUpload.files.push(file)
             const reader = new FileReader()
             reader.readAsDataURL(file)
 
             reader.onload = () => {
                 const image = new Image()
                 image.src = String(reader.result)
 
                 const div = PhotosUpload.getContainer(image)
                 
                 PhotosUpload.preview.appendChild(div)
             }
 
        })

        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },
    hasLimit(event) {
        const { uploadLimit, input, preview } = PhotosUpload
        const { files: filesList } = input

        if (filesList.length > uploadLimit) {
            alert(`Você está tentando enviar mais do que ${uploadLimit} imagens.
            Por favor, envie no máximo ${uploadLimit} imagens do produto.`)
            event.preventDefault()
            return true
        }
        
        const photosDiv = []
        
        preview.childNodes.forEach(item => photosDiv.push(item))

        const totalPhotos = filesList.length + photosDiv.length

        if (totalPhotos > uploadLimit) {
            alert(`Você está tentando adicionar mais do que ${uploadLimit} imagens.
            Por favor, envie no máximo ${uploadLimit} imagens do produto.`)
            event.preventDefault()
            console.log(totalPhotos)
            return true

        }

        return false
    },
    getContainer(image) {
        const div = document.createElement('div')
        div.classList.add('photo')
        div.appendChild(image)
        const removeButton = div.appendChild(PhotosUpload.getRemoveButton())
        removeButton.onclick = PhotosUpload.removePhoto

        return div
    },
    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = 'close'
        
        return button
    },
    removePhoto(event) {
        PhotosUpload.input = event.target
        const photosArray = Array.from(PhotosUpload.preview.children)
        const Photo = {
            div: PhotosUpload.input.parentNode,
            transition: 400,
            index: photosArray.indexOf(PhotosUpload.input.parentNode),
            fade() {
                Photo.div.style.transition = `${Photo.transition}ms`,
                Photo.div.style.opacity = 0
            }
        }

        PhotosUpload.files.splice(Photo.index, 1)
        PhotosUpload.input.files = PhotosUpload.getAllFiles()

        Photo.fade()

        setTimeout(() => {
            Photo.div.remove()
        }, Photo.transition - (Photo.transition / 5))

    },
    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode

        if (photoDiv.id) {
            const removedPhotos = document.querySelector('input[name="removed_photos"]')

            removedPhotos.value += `${photoDiv.id},`

            photoDiv.remove()
        }

    },
    getAllFiles() {
        const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer()

        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    }
}

const ImageGallery = {
    highlight: document.querySelector('.highlight img'),
    previews: document.querySelectorAll('.gallery-preview img'),
    setImage(e) {
        const { target } = e
        const highlight = ImageGallery.highlight

        ImageGallery.previews.forEach(image => image.classList.remove('active'))
        target.classList.add('active')

        highlight.src = target.src
        Lightbox.image.src = target.src
    }
}

const Lightbox = {
    target: document.querySelector('.lightbox'), 
    image: document.querySelector('.lightbox img'), 
    open() {
        Lightbox.target.style.opacity = 1
        Lightbox.target.style.top = 0
        document.body.style.overflow = 'hidden'
    },
    close() {
        Lightbox.target.style.opacity = 0
        document.body.style.overflow = 'initial'
        setTimeout(() => {
            Lightbox.target.style.top = '-100%'
        }, 400) 
    }
}
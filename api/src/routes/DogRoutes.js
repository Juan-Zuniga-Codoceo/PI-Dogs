const { default: axios } = require('axios')
const { Router } = require('express')
const { Dog, Temperament } = require('../../db.js')


let router = Router()

// Obtener un listado de las razas de perros
// Debe devolver solo los datos necesarios para la ruta principal

router.get('/', (req,res) => {
    axios.get('https://api.thedogapi.com/v1/breeds').then( response =>{
        let dogListApi = response.data.map(dog => {

            return {
                id: dog.id,
                name: dog.name,
                image: dog.image,
                temperament: dog.temperament,
                wight: dog.wight,
            }
        })   

//Obtener un listado de las razas de perro que contengan la palabra ingresada como query parameter
//Si no existe ninguna raza de perro mostrar un mensaje adecuado

        Dog.findAll().then((dbdogList) => {

            let FdogList = dbdogList.concat(dogListApi)
            if (req.query.name !== undefined) {
                FdogList = FdogList.filter( dog => {
                    return dog.name.includes(req.query.name)
                })
                if(FdogList === undefined || FdogList.length === 0){
                    return res.status(200).send({message:'Dog not found'})
                }
            }
            return res.status(200).send(FdogList)
        })
    })
})

//- Obtener el detalle de una raza de perro en particular
//- Debe traer solo los datos pedidos en la ruta de detalle de raza de perro
//- Incluir los temperamentos asociados

router.get('/:id', (req, res) => {

    try{
        axios.get('https://api.thedogapi.com/v1/breeds').then(response =>{
        Dog.findAll().then(dbdogList =>{
            let dogList = response.data.concat(dbdogList)
            let filtDoglist = dogList.find( dog => dog.id === Number(req.params.id))
            let result;

            if(filtDoglist === undefined){
                result = { message: 'Dog does not exist'}
            } else {
                result = [filtDoglist].map (dog => {
                    return {
                        name: dog.name,
                        image: dog.image,
                        temperament: dog.temperament,
                        height: dog.height,
                        weight: dog.weight,
                        life_span: dog.life_span,
                    }
                })
            }
            res.status(200).send(result)
        })

        })
    }
    catch(error){
        console.log(error)
    }
})

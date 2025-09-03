import Dev from '../models/programuotojas.js'

const handleErrors = (err) => {
    let errors = {vardas: '', tech: '', laisvas: '', location: ''}
    if(err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message
        })
    }
    return errors
}

// Testavimui: Vilnius - http://localhost:3002/api/programuotojai/?lng=54.68916&lat=25.2798
export const prog_get = async (req, res) => {
  try {
    const { lng, lat } = req.query;
    let devs;

    if (lng && lat) {
      devs = await Dev.find({
        location: {
          $near: {
            $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
            $maxDistance: 100000
          }
        }
      });
    } else {
      devs = await Dev.find();
    }

    res.json(devs);  // JSON visada grąžinamas
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const prog_post = async (req, res) =>{
    try{
        const {vardas, tech, laisvas, location} = req.body

        const newDev = new Dev({
            vardas,
            tech,
            laisvas,
            location
        })
        const savedDev = await newDev.save()
        res.status(201).json(savedDev)
    } catch (err) {
        res.status(400).json({error: err.message})
    }
}

export const prog_put =async (req, res) => {
    try {
        const {id} = req.params
        const update = req.body
        const updatedDev = await Dev.findByIdAndUpdate(id, update, { new: true})
        res.json(updatedDev)
    } catch (err) {
        res.status(400).json({ error: err.message})
    }
}
export const prog_delete = async (req, res) => {
    try{ 
        const {id} =req.params
        const deletedDev = await Dev.findByIdAndDelete(id)
        res.json({message: 'Programuotojas ištrintas sėkmingai'})
    } catch (err){
        res.status(400).json({error: err.message})
    }
}

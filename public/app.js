const { useState, useEffect } = React;

function App() {
  const [devs, setDevs] = useState([]);
  const [form, setForm] = useState({
    vardas: '',
    tech: '',
    laisvas: true,
    lng: '',
    lat: ''
  });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState({
    lng:'',
    lat:''
  })


  const fetchDevs = async () => {
    try {
        let url = '/programuotojai'
        if(form.lng && form.lat){
            url += `?lng=${form.lng}&lat=${form.lat}`
        }
      const response = await fetch(url);
      if (!response.ok) throw new Error('Tinklo klaida');
      const data = await response.json();
      setDevs(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDevs();
  }, []);

  const handleChange = (field, value) => setForm({ ...form, [field]: value })
  const handleSearchChange = (field, value)=> setSearch({...search, [field]: value})

  const handleSubmit = async (e) => {
    e.preventDefault();
    const devData = {
      vardas: form.vardas,
      tech: form.tech.split(',').map(t => t.trim()),
      laisvas: form.laisvas,
      location: { type: 'Point', coordinates: [parseFloat(form.lng), parseFloat(form.lat)] }
    };

    try {
      if (editId) {
        const res = await fetch('/programuotojai/' + editId, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(devData)
        });
        const updatedDev = await res.json();
        setDevs(devs.map(d => d._id === editId ? updatedDev : d));
        setEditId(null);
      } else {
        const res = await fetch('/programuotojai/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(devData)
        });
        const addedDev = await res.json();
        setDevs([...devs, addedDev]);
      }
      setForm({ vardas: '', tech: '', laisvas: true, lng: '', lat: '' });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch('/programuotojai/' + id, { method: 'DELETE' });
      setDevs(devs.filter(d => d._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (dev) => {
    setEditId(dev._id);
    setForm({
      vardas: dev.vardas,
      tech: dev.tech.join(', '),
      laisvas: dev.laisvas,
      lng: dev.location.coordinates[0],
      lat: dev.location.coordinates[1]
    });
  };

  
  return React.createElement('div', null,
    React.createElement('div'),
        React.createElement('input',{
            placeholder: 'Ilguma',
            type: 'number',
            step: 'any',
            value: search.lng,
            onChange: e=> handleSearchChange('lng', e.target.value)
        }),
        React.createElement('input',{
            placeholder: 'Platuma',
            type: 'number',
            step: 'any',
            value: search.lat,
            onChange: e=>handleSearchChange('lat', e.target.value)
        }),
    React.createElement('form', { onSubmit: handleSubmit },
      React.createElement('input', {
        placeholder: 'Vardas',
        value: form.vardas,
        onChange: e => handleChange('vardas', e.target.value),
        required: true
      }),
      React.createElement('input', {
        placeholder: 'Kalbos',
        value: form.tech,
        onChange: e => handleChange('tech', e.target.value),
        required: true
      }),
      React.createElement('input', {
        placeholder: 'Ilguma',
        type: 'number',
        step: 'any',
        value: form.lng,
        onChange: e => handleChange('lng', e.target.value),
        required: true
      }),
      React.createElement('input', {
        placeholder: 'Platuma',
        type: 'number',
        step: 'any',
        value: form.lat,
        onChange: e => handleChange('lat', e.target.value),
        required: true
      }),
      React.createElement('label', null,
        React.createElement('input', {
          type: 'checkbox',
          checked: form.laisvas,
          onChange: e => handleChange('laisvas', e.target.checked)
        }),
        ' Laisvas'
      ),
      React.createElement('button', { type: 'submit' }, editId ? 'Atnaujinti' : 'Pridėti'),
      editId && React.createElement('button', {
        type: 'button',
        onClick: () => {
          setEditId(null);
          setForm({ vardas: '', tech: '', laisvas: true, lng: '', lat: '' });
        }
      }, 'Atšaukti')
    ),
    React.createElement('ul', null,
      devs.map(dev =>
        React.createElement('li', { key: dev._id },
          React.createElement('strong', null, dev.vardas),
          ' - ', dev.tech.join(', '),
          ' - ', dev.laisvas ? 'laisvas' : 'užimtas',
          React.createElement('br'),
          'Koord.: ', dev.location.coordinates[0], ', ', dev.location.coordinates[1],
          React.createElement('br'),
          React.createElement('button', { onClick: () => handleEdit(dev) }, 'Redaguoti'),
          React.createElement('button', { onClick: () => handleDelete(dev._id) }, 'Ištrinti')
        )
      )
    )
  );
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));

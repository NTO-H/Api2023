import mongoose from 'mongoose';

const bitacoraSchema = new mongoose.Schema({
     
_id: { type: String, required: false },
fecha_hora: { type: String, required: false },
mensaje: { type: String, required: false },
codigo_tarjeta: { type: String },
estado_puerta: { type: String, required: false }}




);

const Bitacora = mongoose.model('bitacoras', bitacoraSchema);

export default Bitacora;

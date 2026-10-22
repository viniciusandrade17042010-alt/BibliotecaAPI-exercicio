import mysql from 'mysql2/promise';
function conectarBanco(){
    const conexao = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT   
    });
    return conexao;
} //função que conecta ao banco de dados
export default conectarBanco;//  os outras partes do sistema usar essa funcção exportando ela
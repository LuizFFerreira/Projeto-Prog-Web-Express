const MongoClient = require("mongodb").MongoClient;

module.exports = class Publicacao{

    static async insert(data, usernamed){
        const conn = await this.startConn(),
              db = conn.db();
        
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        
        today = dd + '/' + mm + '/' + yyyy;
        db.collection("publicacoes").insertOne({
            titulo: data.titulo,
            conteudo: data.conteudo,
            username: usernamed,
            publicacao: today,
            ultima_atualizacao: today,
            visualizacoes: 0
        },
        function(err, res){
            conn.close();
        });

    }

    static async findOne(id){
        const conn = await this.startConn(),
              db = conn.db();
        
        let publicacao = await db.collection("publicacoes").findOne({_id: id});

        conn.close();
        return publicacao;
    }

    static async findSome(query){
        const conn = await this.startConn(),
              db = conn.db();
        
        let publicacoes = await db.collection("publicacoes").find(query,
                                                                  {projection: {
                                                                    _id: 1,
                                                                    titulo: 1, 
                                                                    username: 1,
                                                                    publicacao: 1
                                                                   }}).toArray();

        conn.close();
        return publicacoes;
    }

    static async updateOne(id, new_values){
        const conn = await this.startConn(),
              db = conn.db();
        
        await db.collection("publicacoes").updateOne({_id: id}, new_values);

        conn.close();
    }

    static async startConn(){
        return await MongoClient.connect("mongodb://localhost:27017/projeto_express");
    }

}

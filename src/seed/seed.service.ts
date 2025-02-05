import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,
    // private readonly pokemonService: PokemonService // otra forma

    private readonly http: AxiosAdapter,
  ){}
  async executeSeed(){

    await this.pokemonModel.deleteMany({}); // delete * from pokemon;

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');
    
    // // 1
    // const insertPromisesArray = [];

    // data.results.forEach(({name, url}) =>{
    //   const segments = url.split('/');
    //   const no:number = +segments[ segments.length - 2 ];
    //   // console.log({name, no})
    //   // const pokemon = await this.pokemonModel.create({name, no});
    //   // await this.pokemonService.create({name,no}); // otra froma

    //   // 1 sin async
    //   insertPromisesArray.push(
    //     this.pokemonModel.create({name, no})
    //   );
    // });
    
    // //1
    // await Promise.all( insertPromisesArray );

    
    // 2
    const pokemonToInsert: { name: string, no: number }[] = [];

    data.results.forEach(({name, url}) =>{
      const segments = url.split('/');
      const no:number = +segments[ segments.length - 2 ];
      
      pokemonToInsert.push({ name, no });
    });
    
    await this.pokemonModel.insertMany( pokemonToInsert );
    // insert into pokemons (name, no)
    // (), (), ....
    return 'Seed Executed';
  }
}

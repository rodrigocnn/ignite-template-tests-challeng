import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let statementsRepositoryInMemory : InMemoryStatementsRepository
let userRepositoryInMemory: InMemoryUsersRepository 
let createUserUseCase: CreateUserUseCase
let createStatementUseCase: CreateStatementUseCase
let getStatementOperationUseCase: GetStatementOperationUseCase

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

describe("Statement", ()=>{

    beforeEach(()=>{
        userRepositoryInMemory = new InMemoryUsersRepository()
        statementsRepositoryInMemory = new InMemoryStatementsRepository()
        createStatementUseCase = new CreateStatementUseCase(userRepositoryInMemory, statementsRepositoryInMemory)
        getStatementOperationUseCase = new  GetStatementOperationUseCase(userRepositoryInMemory, statementsRepositoryInMemory)
        createUserUseCase = new CreateUserUseCase(userRepositoryInMemory)
    })
    
    it("Should be able to return info about a statement created ", async ()=>{
        
        const user: ICreateUserDTO = {
            email: "user@teste.com",
            password: "1234",
            name: "User Test",
          };

        const userCreated = await createUserUseCase.execute(user);
        const user_id = userCreated.id as string
        const deposit  = {user_id,type: "deposit" as OperationType, amount: 100, description: "DINDIN"}
        const statement = await createStatementUseCase.execute(deposit)
        const statement_id = statement.id as string
        const result =  await getStatementOperationUseCase.execute({user_id, statement_id})
        expect(result.type).toEqual("deposit")
        
    })


 
})
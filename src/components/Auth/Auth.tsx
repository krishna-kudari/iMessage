import { CreateUsernameData, CreateUsernameVariables } from "@/src/util/types";
import { useMutation } from "@apollo/client";
import { Button, Center, Stack,Text, Image, Input} from "@chakra-ui/react";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import UserOperations from '../../graphql/operations/user';

interface IAuthProps {
    session: Session | null;
    reloadSession: () => void;
}


const Auth: React.FC<IAuthProps> = ({session , reloadSession}) => {
    const [username , setUsername ] = useState("");
    const [createUsername, { loading , error}] = useMutation<CreateUsernameData , CreateUsernameVariables>(UserOperations.Mutations.createUsername);

    // console.log("HERE IS HERE",data , loading , error);
    
    const onSubmit = async () => {
        if(!username)return ;
        try {
            // createUsername  mutation to send our username to GRApHQL API
            const { data } = await createUsername({ variables: { username } ,context:{session:session}});
            if(!data?.createUsername){
                throw new Error();
            }
            if(data.createUsername.error){
                const {createUsername :{error}} = data;
                
                throw new Error( error );
            }
            console.log("DATA FROM CREATEUSERNAME",data);
            toast.success('Username  successfully created! 🚀✅')
            /* reload session to obtain new username*/
            reloadSession();
        } catch (error ) {
            if(error instanceof Error)toast.error(error.message)
            console.log("onSubmit error", error);
        }
    }
  return (
    <Center height='100vh' >
        <Stack spacing={8} align={'center'}>
            {session ? (
                <>
                <Text fontSize={'3xl'}>Create a username</Text>
                <Input placeholder="Enter a username" value={username} onChange={(event) =>setUsername(event.target.value)} />
                <Button width={"100%"} onClick={onSubmit} isLoading={loading}>Save</Button>
                </>
            ):(<>
            <Text fontSize={"3xl"}>MessangerQL</Text>
            <Button onClick={() => signIn('google')} leftIcon={<Image height={'20px'} src='/images/googlelogo.png' />}>Continue with google</Button>
            </>)}
        </Stack>
    </Center>
  )
};

export default Auth;

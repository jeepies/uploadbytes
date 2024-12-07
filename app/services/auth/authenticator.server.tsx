import { Authenticator } from 'remix-auth';
import formStrategy from './strategies/form.server';

// TODO separate the type definition into a types file

export let authenticator = new Authenticator<{
	data: { [k: string]: string | object };
	form: string[];
	field: { [k: string]: string[] | undefined };
	hasErrored: boolean;
}>();

authenticator.use(formStrategy);

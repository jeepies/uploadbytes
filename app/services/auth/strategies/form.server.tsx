import { FormStrategy } from 'remix-auth-form';
import bcrypt from 'bcryptjs';
import * as schemas from '../schemas/form.server';
import * as users from '~/services/models/user.server';

const formStrategy = new FormStrategy(async ({ form, request }) => {
	const type = form.get('type');
	const payload = Object.fromEntries(form);
	delete payload.type;

	const returnable = {
		data: {},
		form: [],
		field: {},
		hasErrored: false,
	};

	if ((type as string).toLowerCase() === 'register')
		registerHandler(payload, request, returnable);
	else if ((type as string).toLowerCase() === 'login')
		loginHandler(payload, request, returnable);

	if(returnable.form.length !== 0 || Object.entries(returnable.field).length !== 0) returnable.hasErrored = true;

	return returnable;
});

async function registerHandler(
	form: { [k: string]: FormDataEntryValue },
	request: Request,
	returnable: {
		data: { [k: string]: string | object };
		form: string[];
		field: { [k: string]: string[] | undefined };
	},
) {
	const payload = schemas.registerSchema.safeParse(form);

	if (!payload.success && payload.error) {
		const error = payload.error.flatten();
		returnable.form = error.formErrors;
		returnable.field = error.fieldErrors;
		return;
	}

	const { email, username, password, acceptTOS } = payload.data;

	if (!acceptTOS) {
		returnable.form = ['Please read and accept the terms and conditions'];
		return;
	}

	const isUsernameTaken = await users.doesUsernameExist(username);
	if (isUsernameTaken) {
		returnable.field.username = ['This username already exists'];
		return;
	}

	const isEmailTaken = await users.doesEmailExist(email);
	if (isEmailTaken) {
		returnable.field.email = ['This email already exists'];
		return;
	}

	const hashedPassword = await bcrypt.hash(password, 12);

	const user = {
		username: username,
		password: hashedPassword,
		email: email,
	};

	returnable.data.user = await users.createUser(user);

	return;
}

async function loginHandler(
	form: { [k: string]: FormDataEntryValue },
	request: Request,
	returnable: {
		data: { [k: string]: string | object };
		form: string[];
		field: { [k: string]: string[] | undefined };
	},
) {
	const payload = schemas.loginSchema.safeParse(form);

	if (!payload.success && payload.error) {
		const error = payload.error.flatten();
		returnable.form = error.formErrors;
		returnable.field = error.fieldErrors;
		return;
	}

  return;
}

export default formStrategy;

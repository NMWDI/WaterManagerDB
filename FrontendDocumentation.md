
---
### High-level Purpose/Functioning
- As with most frontends, the goal of this frontend is to provide an abstracted way for the user to interact with any underlying data.
- The frontend allows users
- This frontend is entirely client side rendered and makes API calls to pull in or make updates to the existing data.
- The codebase has been mostly migrated to TS/TSX and new components are written in TS/TSX but some pieces are still JS/JSX.


---
### Main Technologies
- React - JS/TS framework
- React Query - API handling (async server state management)
- React Hook Form - Multi-input form values/state/validation handling
- Yup - Input validation
- React Auth Kit - Frontend auth/JWT management
- MUI - Component library


---
### Directory Structure (from /src)
-  /components/ --- Higher-level/reusable components
	- /RHControlled/ --- MUI input components wrapped with a React Hook Form controller (and some abstractions on them for app-specific inputs (eg: ControlledMeterSelect.tsx))
- /css/ --- Assorted CSS files used by certain components
- /img/ --- Images used throughout the app
- /service/ --- Services used across multiple components/pages
	- ApiServiceNew.tsx --- Provides hooks used to consistently interact with the backend
- /views/ --- Contains directories that hold components relating to the specified page
- API_config.js --- Defines the backend URL
- App.css --- Assorted CSS classes (mostly unused)
- App.tsx --- The app's main container/view, defines side/topnav layout and handles routing
- enums.ts --- Various app-specific enums mostly used for interfacing with the backend
- index.js --- The app's entrypoint (renders App.tsx)
- interfaces.ts --- Interfaces that mostly represent backend data structure
- login.js --- The app's login page
- sidenav.css --- Styling for the sidenav component
- sidenav.tsx --- The navigation component (left side)


---
### Views
As mentioned above, this directory holds each of the "pages" of the site (as seen in the sidenav). The layout of the app is defined in App.tsx and based on the router, one of these "pages" is shown.

Each directory contains all of the components specific to the given page, with pageNameView.tsx serving as the highest level component for the given page. That naming convention generally follows for any sub-directories where xView.tsx is the component that controls/manages the other components in the directory.


---
### Component Structure
Each component aims to handle one piece of functionality whether that be managing/coordinating other components or handling a specific type of data display/entry, so each file generally only has one component.

The component's files begin with any necessary imports, then defines an interface that specifies the component's props and their types. The component's body typically declares any variables/stateful values, then any necessary logic or functions, then returns the TSX.

The highest level/pageView component's TSX/HTML are typically inside of an MUI Box element that includes a page title, and an MUI Grid layout of any content or child components.

Lower level pages typically follow a similar idea but with the highest level element being an MUI Card containing a CardHeader with the title, and CardContent with the Grid layout of it's content.

See the UserManagement directory for a relatively simple/clean example of this.


---
### Page Styling/Layout
- Most styling is done inline through MUI components' sx prop.
- Most page layout is done through the MUI grid.
- Pages are currently responsive enough to support viewing on screens tablet sized through standard large monitor size.

---
### Security
This app uses JWTs for authenticating user requests. Authentication related things on the frontend are managed mostly through React Auth Kit and all login functionality occurs in the login.js component (logging out can be done anywhere with the signOut() hook).

When a user makes a request to the login endpoint, their credentials are validated and if it was a valid login, a JWT is generated and returned in the response along with various useful info about the user such as their name, role, and permissions at the time of the request. The user is then logged in and their information and JWT is stored using the React Auth Kit signIn() function.

React Auth Kit provides the useAuthHeader() hook to get the current user's JWT and token type in a format that we can simply assign to the 'Authorization' key of a request's header. This auth header should be sent with every request to the backend, see GETFetch in ApiServiceNew.ts

The user will only see pages in the sidenav (sidenav.tsx) which they are allowed to visit, right now the pages are just classified as either regular or admin pages, any logged in user will see the regular pages and we determine if they should see the admin pages by checking if the user has the admin scope. We check the user's scopes on the frontend by using the React Auth Kit useAuthUser() hook, this provides us all of the user's information that was recieved when they logged in.

The actual page routes are also protected by scope (route's required scopes are defined in App.tsx), and again most routes are only protected if they are admin related. If the user attempts to visit a route they aren't allowed to, they will be redirected to the homepage and informed that they do not have sufficient permissions to view this page.


---
### API Interaction (ApiServiceNew.tsx)
Interaction with the API has been almost entirely migrated to use abstracted React Query hooks, allowing developers to simply use the hook and provide it any necessary parameters, then when these parameters are updated the data returned by the hook is also updated (in the case of GET requests).

The hooks defined in apiservicenew.tsx generally follow the same format where a route is defined, the authHeader is retrieved, and that info is used to create a fetch function (via GETFetch/POSTFetch/etc) that is used as our useQuery queryFn. The hook then returns a useQuery hook that is configured for this

##### Get Requests / useQuery
For example: if we want to get a list of meters we use the useGetMeterList() hook, which takes params of type MeterListQueryParams (search_string, sort_by, sort_direction, limit, offset, exclude_inactive), and anytime we update the parameters a new request will be made to the backend to get the appropriate data. This new data will then automatically populate or update the .data attribute of the object our hook returned.

Query hooks (making HTTP GET requests, using useQuery): return an object with a .isLoading attribute that is true if the request is currently being made, and a .data attribute that holds the response.

>Eg:
>const meterList = useGetMeterListQuery(params)
>meterList.isLoading - tells us if the meter list request is loading
>meterList.data - gives us access to the response, in this case a Page<MeterListDTO\>

>Therefore, meterList.data always contains the current meter list value based on the params.

In the case of query/get hooks, a navigate and signOut hook is passed to the HTTP request function (GETFetch) so that the user can be logged out and navigated home if the server indicates that the user's current JWT is expired. This probably isn't the ideal way to handle this and should be refactored at some point.

##### POST/PATCH Requests / useMutation
Mutation hooks (HTTP POST/PATCH requests, using useMutation): return an object with a .mutate function that is used to make the POST or PATCH request. These mutation hooks provided by ApiServiceNew.tsx also accept an onSuccess callback function that will be run if the mutation was successful, and failure handling is currently implemented in the api service.

>Eg:
>const createMeter = useCreateMeter(onSuccess)
>createMeter.mutate(newMeter) - calls the mutationFn (from the hook's definition in api service)

>If the mutation is successful, the onSuccess callback is run, if not, the mutationFn handles showing any errors. Note that response code 422 is always returned by FastAPI if the incoming request body's format/typing does not match the schema defined in the endpoint function parameters.

##### State Updates on Successful POST/PATCH
When a mutation is successfully performed, we want to update any state used in the UI that should reflect this mutation (Eg: when we update a user's role, we want to see that user's role change in the table of users.)

Since we're using React Query to manage server-related state, we can use the queryClient.setQueryData() function that it provides to manually update the value of any existing query data when a mutation is successful without having to perform another network request to get the updated information.

Our backend will always return the qualified object (or as qualified as we need it to be) on a post/fetch. Given that our mutation was successful, we can use this returned value to manually update/add to any queries that are used in the app through queryClient.setQueryData().

>Eg:
  We are admins editing a user's role. The user's role is reflected both in the table of users and in the card that shows individual user's details. We update the role on the card in order to make changes, so it's state will be accurate on a mutation, but we want to see the user's updated role reflected on the table.

>Since the table's data/state comes from the useGetUserAdminList() hook (which GETs from the /usersadmin route), we can simply update the query data for that route and see the changes reflected anywhere that query is used (in this case, the users table).

>In the useUpdateUser() hook, we check that the update was successful, and if so we use:

>queryClient.setQueryData(['usersadmin'], (oldUsers: User[]) => ())

>This allows us to specify a route, and pass in a callback that takes the current list of users, modify it any way we need, and return an updated version that will replace

When trying to update a query that was fetched with parameters such as the meters list, you must iterate through all queries of a route and perform the update described above on each query. See useUpdateMeter for an example.

##### Note on HTTP Client
The application is currently using fetch as an HTTP client but it's interception and error handling capabilities are pretty much non-existant and is the reason for a lot of the contrived interception and error handling that occurs in the api service. Migrating to Axios or any more robust HTTP client should probably be a high priority.


---
### Form Handling (React Hook Form)
Some of the forms in the app are quite dynamic and have field values that change based on inputs to other fields, and most form values are validated before submission in order to show user's specific errors and prevent submission with incorrect data. All of these requirements lend themselves very nicely to using React Hook Form which supports tracking/modifying anything in the form's state (even across components) as well as super nice integration with Yup to validate the form's inputs and show the specific errors on their related inputs.

Handling form data typically functions as follows (will use PartDetailsCard.tsx as an example):

>A Yup validation schema is defined (usually as model/interfaceResolverSchema at the top of the component) which should include all validation that needs to be performed on the associated inputs before the form is allowed to be submitted.

>For example, we define the PartResolverSchema and want to ensure a part_number is defined and that it is a string. We define the PartResolverSchema as a Yup.ObjectSchema of type any so that it doesnt force us to use all of the fields and types on an interface. Then to declare that the part_number field is required and is a string we declare:
>
> part_number: Yup.string().required('Please enter a part number.')
>
> Any text passed into the required method will be shown to the user if the field is not used, for type error messages we can use the .typeError('err message') method, whichever validation rule was broken first will be shown to the user with its defined error text.
>
> Next, we use the React Hook Form useForm() hook to get an instance of the form, we destructure the returned instance object to pull out the functions and variables we need, see the React Hook Form documentation for a full list. The most commonly used variables and functions are:

- **handleSubmit** - The function that should be called when a user attempts to submit the form, the first parameter should be the mutation function, and the second parameter should be an error handling callback (if desired).

- **control** - The reference to the form that is used to register inputs with their associated field on the form.

- **setValue** - A function that allows programmatically setting fields on the form, useful if the form fields should change dynamically based on other selections and/or be set based on API data.

- **reset** - A function that allows clearing all fields of the form.

- **watch** - A function that returns the current field value of the form. Can be used as the dependency in a useEffect hook to watch for changes, and can be used to render current field values outside their input if desired.

- **formState: { errors }** - We destructure the formState to get the errors object which contains the form's current current validation errors as determined by the Yup resolver. Note that the validation is only performed after the first submit by default.

>Once we have our useForm hook set up, we just need to register the fields of the form to inputs on our component. The /components/RHControlled/ directory contains controlled variants of most MUI inputs, as well as some further abstracted controlled inputs for things such as meter and well selections. Most of these components accept the following props:

- **name** - The name of the field on the form to register this input to.
- **control** - The control reference we got from useForm().
- **label** - The text that should label the input when rendered.
- **error** - A boolean value determining if the given input has an error.
- **helperText** - The current error message.
- **Note:** error and helperText as described above are only used in some controlled inputs, others only have the error prop, and it should just be passed the error message. Also, aside from these specfic props, if any additional props are defined they will be passed down to the actual MUI component inside the wrapped and applied there through a spread.

In order to fully understand the RHControlled components I would recommend reading the React Hook Form documentation on controlled inputs, it specifically has examples for MUI components. And, in order to understand the further abstracted controlled components such as ControlledMeterSelect I would read the code for the component and read the code of the underlying component that it abstracts upon (ControlledAutocomplete in the case of ControlledMeterSelect)

**IMPORTANT:** It is worth noting that most controlled components are written to control full objects, not IDs as is typical in more vanilla/standard inputs. Eg: ControlledMeterSelect expects to receive the name of the React Hook Form field that represents an entire Meter or MeterListDTO object, so that when a meter is changed, the entire object in the form is changed, meaning that if you select meter A using the ControlledMeterSelect component, any field on the form that is registered to an attribute of the meter object will update to the value of that attribute on meter A. As opposed to a regular HTML select, where changing the value just updates something like an ID.

This may feel heavy, and it somewhat is, but for some of the requirements of this app's forms I've found it best to always have the fully qualified, current object present in the form context.

>For example, if we want to allow the user a text box to enter/view the part number, we can use a ControlledTextbox component and pass in:

- name="part_number" - This defines what field in the form the input relates to
- control={control} - This allows the input to be registered/synced with the form
- label="Part Number" - This label will be shown in the UI
- error={errors?.part_number?.message != undefined} - This will determine if there is an erorr on the input.
- helperText={errors?.part_number?.message} - This will give the input the error message if one exists.

>Now, if a user enters a value in this textbox, the part_number field in our form will be updated and if the user tries to submit the form without entering a value the error object will have an error and associated message for the part_number field which will be shown on the input.

The error and helperText props / pattern used here isn't necessarily the best way and could definitely be improved upon, but in my experience it hasn't caused any problems that necessitate refactoring.

---
### The Activities Page
The activity entry form is by far the most intricate page/form in the app because some fields in the form are based on other fields in the form, and the form inputs are spread out through many components because each section has it's own responsibilities for getting certain data, updating certain fields, and specific functions that would become very unwieldy if placed all in one component.

I will attempt to descibe it's general functioning here, but note that having a fair understanding of React Hook Form will be important for being able to reason about this page.

The parent component of the activity form is MeterActivityEntry.tsx, this component is where the useForm hook is defined, and some the broader reaching state management occurs. I think of this component like the outline and structure of the full form, and then the children components as the pieces that recieve user input, display appropriate UI, and update the section on the full form that they're responsible for.

Also note the ActivityFormConfig.ts file in the same directory which contains the Yup validation schema, default values for the form, and a toSubmissionForm that converts the current React Hook Form state that has multiple large objects in it, into the minimal information we need to send to the backend for it to process the activity submission.

**IMPORTANT:** Clarifications and expansion on some of my verbiage here:
- "Field" - A field on the React Hook Form form instance (eg: if we have a form of type Meter, a field could be id, serial_number, well, etc).
- "Object" - Sometimes I use "Object" and "Field" interchangably, this is because a field on the form instance can be an object (eg: if we have a form of type Meter, I may use "field" or object to refer to the well). "Object" is typically used to emphasize that the field is an object and so changing the well field will change any field that references attributes on that well field (eg: well.id).
- "Input" - This is a user input that is associated (registered) with a specific field of the form, defined by the name prop of the controlled component. This may be a simple type such as a string or number, or more complex types such as an object. Eg: "current_installation.well" is passed as the name to a ControlledWellSelect component, meaning that when a user changes the well from this component, the entire well object in the form is updated to that selected well. So if another input is associated with "current_installation.well.id", changing the well from the ControlledWellSelect will change the value in this input.

So, the general functioning of the activity form:

> At the top of MeterActivityEntry.tsx, a few hooks/values that we need are defined such as:

- **searchParams** - The current route's search/queryParams that will be set if we are coming to this page via the 'Start a new Activity' button on the meters page.
- **meterID** - The currently selected meter's ID, represented as a stateful value instead of just in the form since we use it as the useGetMeter hook's params and we update it based on form selections to get new meters' details.
- **wellID** - Same as above.
- **meterDetails** - The details of the meter specified by meterID.
- **wellDetails** - The details of the well specified by wellID.
- **hasActivityConflict** - Tracks if the user is attempting to perform a conflicting activity on their selected meter (eg: Installing an installed meter).
- **isMeterAndActivitySelected** - Tracks if the user has selected both an activity and meter.

> We then declare the function we will use as a callback when the activity is successfully submitted (onSuccessfulSubmit), and the createActivity() hook that will allow us to send this activity to the backend.

> Next, we get the searchParams values that will be provided if this page was navigated to through the "New Activity" button on the meters page. If all expected values that descibe the meter they navigated from are found, we use this as the initially selected meter.

> Then, we define our form, note the ActivityFormControl type on the useForm hook, this is an interface that defines all the values/state that we want to track on the form while the user is entering information. When defining the form, we use the schema defined in the ActivityFormConfig.ts file as the resolver, and set the default values based on the function from that same file, which we pass the initial meter into if we found one.

> Then, we define our onSubmit function that will be called if no validation errors are found, in this case it simply calls our createActivity mutate function and passes in the result of our toSubmissionForm function that recieves the current form (data) as a parameter.

> Next, we get into the multiple useEffect hooks, I've attempted to pull most useEffects into this parent component because almost all of them perform some action to change the form's state and I found it a little easier to think about the possible ways state can change if it's happening in one place instead of across multiple different components. I will label the useEffect descriptions by their dependencies, but at least at the time of writing this they should be in this order in the code as well:

>     **watch("activity_details.selected_meter")?.status?.status_name, watch("activity_details.activity_type")?.name**
>
>     This useEffect watches for changes to the selected meter and activity type to determine if there is a conflict between them by setting hasMeterActivityConflict to a logical statement that returns true if there is a conflict, and false if there isn't.
>
>     **IMPORTANT:** Note that "activity_details.selected_meter" is in the string part of the watch, and the real attribute it wants to watch for is optional-chained onto it, this is because sometimes the React Hook Form watch wont update if a single field of the form is updated via updating it's parent object on the form. Eg: if the selected_meter object is changed,  watch() and useEffect() may not recognize this as a change on selected_meter.status.status_name and wont run the useEffect body. I'm not super confident this is necessary but when writing the page, this was the only way it was picking up those updates, so that's the general reasoning for it wherever it may be used in the code.


>     **watch("activity_details.selected_meter"), watch("activity_details.activity_type")**
>
>     This useEffect watches for changes to the selected meter or activity type to determine if both are selected by setting isMeterAndActivitySelected to a logical statement that returns true if they are, and false if they arent.

>     **watch(meterDetails.data)**
>
>     This useEffect watches for new meterDetails data, which will be updated when the meterID changes. When we recieve the new meterDetails data we check that it's not null and then set the form's current_installation.meter field to this current meterDetails. Since changing a meter also results in changing a well, we also set the wellID based on the well.id of this meter.

>     **watch("activity_details.selected_meter")**
>
>     This useEffect watches for changes to the currently selected meter and updates the meterID value to reflect this. Recall that changing meterID gets new meterDetails for this meterID.
>
>     I'm not confident this whole process with the meterID, wellID, meterDetails, and wellDetails is the best way to do this and could be a good thing to refactor because it's very hard to reason about in my opinion.

>     **wellDetails.data**
>
>     This useEffect sets the form's well field to the updated wellDetails, similar to the useEffect for meterDetails.data.

These are the broadest state changes, but some child component specific state changes happen in the children components themselves, these changes shouldnt effect anything outside of the fields the given component is responsible for.

> Finally, we lay out our children components in the TSX, passing each of them the control reference, the errors object, the watch function, and the setValue function which are the full set of React Hook Form objects/ref/functions that a child component should need to handle updating the full form.

Each of the children components are essentially just MUI Grid layouts of controlled inputs that are tied to a specific field on the full form, and they include any section-specific state or logic that is needed.


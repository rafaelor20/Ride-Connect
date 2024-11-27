# avoid routine error problem: error:0308010C:digital envelope routines::unsupported
FROM node:16

# folder where the build will go
WORKDIR /tmp/react

# copy files into the WORKDIR folder
COPY . .

# install project dependencies
RUN npm i

# bugfix - while using CRA to build
RUN chmod a+x /tmp/react/node_modules/.bin/react-scripts 

# create the optimized production version
RUN npm run build

# start the app
CMD ["npm", "run", "start"]

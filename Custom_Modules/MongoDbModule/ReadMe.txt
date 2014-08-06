------------------ MongoDb Driver Module ReadMe ----------------------------
 
Structure:
    Returned object has Seven properties,
        Dataset,
        Deploy,
        User,
        Release,
        TestRun,
        TestConfiguration,
        TestSuite,
    Corresponding to each collection.
    
    Each property has four methods:
        read([SearchObj], callback(err, data), [OptionsObj]),
        update([SearchObj], [ObjToUpdate], callback(err, data), [OptionsObj]),
        insert([ObjToInsert], callback(err, data), [OptionsObj]),
        remove([ObjToRemove], callback(err, data), [OptionsObj])
 
Methods:
    Read([SearchObj], callback(err, data), [OptionsObj])
        Properties:
            [SearchObj]
                Description: The object to perform a search by.
                Notes: Field names are case sensitive, passing an empty object will return all available results.
            callback(err, data)
                Description: Callback function called once database call is complete
                Note: See callback section for info
            [OptionsObj]
                Description: Optional OPTIONS object
                Notes: See options section for info
             
       update([SearchObj], [ObjToUpdate], callback(err, data), [OptionsObj])
            Properties:
                [SearchObj]
                    Description: The object to perform a search by.
                    Notes: Field names are case sensitive, passing an empty object will return all available results.
                [ObjToUpdate]
                    Description: The object to update matching results by.
                    Note: MongoDb's $set property will be applied internally.
                callback(err, data)
                    Description: Callback function called once database call is complete
                    Note: See callback section for info
                [OptionsObj]
                    Description: Optional OPTIONS object
                    Notes: See options section for info        
                    
       insert([ObjToInsert], callback(err, data), [OptionsObj])
            Properties:
                [ObjToInsert]
                    Description: The object to insert into the collection.
                    Note: If a field being inserted does not exist MongoDb will create it, But only for the inserted record.
                callback(err, data)
                    Description: Callback function called once database call is complete
                    Note: See callback section for info
                [OptionsObj]
                    Description: Optional OPTIONS object
                    Notes: See options section for info
       remove([ObjToRemove], callback(err, data), [OptionsObj])    
           Properties:
                [ObjToRemove]
                    Description: The object to remove from collection.
                    Note: See options section for MongoDB's 'multi' flag.
                callback(err, data)
                    Description: Callback function called once database call is complete
                    Note: See callback section for info
                [OptionsObj]
                    Description: Optional OPTIONS object
                    Notes: See options section for info 
 
Callback(err, data) Function
    Description: Function called once database call is complete, 
    NOTE: Some default MongoDb options are applied to enforce the callback function to be 
          called after the database call is made. 
 
    Arguments:
        Err: The error object if an error occured, will be null otherwise.
             The error object has to properties, ErrorMessage and Stack.
        Data: The returned data object, this object has a different structure for each method.
            read:
                Count: Total number of results
                Data: Results
            update:
                Count: The number of updated objects
                Updated: The fields that were updated
            insert:
                Count: Number of records inserted
                Inserted: The inserted records
            remove:
                Count: Number of removed records
                Removed: The search object that removed the records, will be null if no records were removed.
 
Options Object
    Description: An optional options object that can contain MongoDb options properties and external options properties.
    External Options:
        useBuilder:
            Description: Boolean, default false, when true the methods, query, search, insert or remove objects will be passed through a
            query builder. This will lowercase all properties then match them with the corresponding property and format 
            the case. If no matches are found it returns an empty object. If the input object contains any MongoDb
            specific properties like $in it will skip the builder and return the input object un-modified.
        
    IMPORTANT NOTE:
        Some MongoDb properties are already set within specific methods to ensure the callback function is called after the database
        call is made. These are:
            Method remove: 
                Property 'w' is set to 1.
            Method insert:
                Property 'safe' is set to true.


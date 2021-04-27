let allClasses = []
let token = `Bearer BYgPleMeIB9S0zJ2FQRG6vtsrq9rnbS8jvtTW4qHD_QwAN_lB1kkaO7tuZ_GGdtnpbHsT_ek1NhHXgziSynfCgFZGzVHrw3hltm0i7NPRuT6lyS`
const scanDatabase = async _ => {
    console.log('Scanning Started')
    for (let index = 0; index < 8500; index += 100) {
        let retrievedCourses = await parseClassListing(index)
        saveListing(retrievedCourses)
    }
    console.log("classes.json populated")
    filterSkills()
    filterClasses()
}

const parseClassListing = (i) => {
    return getClassListing(i).then(res => {
        let unique_id = 0
        let allClassCodes = res.elements.map(code => (
            {
                id: unique_id++,
                urn: code.urn,
                name: code.title.value,
                type: code.type,
                description: code.description.value,
                shortDescription: code.shortDescription.value,
                // Availability returned undefined, changed address from instructions after vertifying with postman. 
                availability: code.availability,
                classificationName: code.details.classifications.map(types => types.associatedClassification.name.value),
                classificationId: code.details.classifications.map(types => types.associatedClassification.urn),
                classificationType: code.details.classifications.map(types => types.associatedClassification.type),
                courseURL: code.urls.webLaunch,
                AICCURL: code.urls.aiccLaunch 
            }
        ))
        return allClassCodes
    })
}

const getClassListing = (queryStart) => {
    // Routed request through Heroku server to avoid CORS issue
    return fetch(`https://limitless-citadel-23911.herokuapp.com/https://api.linkedin.com/v2/learningAssets?q=criteria&assetFilteringCriteria.assetTypes[0]=COURSE&assetFilteringCriteria.locales[0].language=en&assetFilteringCriteria.locales[0].country=US&count=100&start=${queryStart}`, {
        headers: {
            "Authorization": token
        }
    })
        .then(res => res.json())
}

const saveListing = (classListing) => {
    const classEntry = JSON.stringify(classListing)

    return fetch('http://localhost:8000/skills', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: classEntry
    })
}

const filterSkills = () => {
    getSkills()
        .then(res => {
            let skillsArray = []
            let flattenedSkills = [].concat.apply([], res)
            for (let i = 0; i < flattenedSkills.length; i++) {
                for (let j = 0; j < flattenedSkills[i].classificationId.length; j++) {
                    if (flattenedSkills[i].classificationType[j] === "SKILL") {
                        let thisURN = flattenedSkills[i].classificationId[j].split(":")[3]
                        skillsArray.push(
                            {
                                skillType: flattenedSkills[i].classificationType[j],
                                skillName: flattenedSkills[i].classificationName[j],
                                skillURN: thisURN
                            }
                        )
                    }
                }
            }
            let uniqueSkills = skillsArray.reduce((unique, o) => {
                if (!unique.some(obj => obj.skillType === o.skillType && obj.skillName === o.skillName && obj.skillURN === o.skillURN)) {
                    unique.push(o);
                }
                return unique;
            }, []);
            let sortedUniqueSkills = uniqueSkills.sort((a, b) => (parseInt(a.skillURN) > parseInt(b.skillURN)) ? 1 : -1)
            saveUniqueSkills(sortedUniqueSkills)
        }
        )
}

const getSkills = () => {
    return fetch("http://localhost:8001/skills")
        .then(res => res.json())
        .then(parsedData => allClasses = parsedData)
    }

    const saveUniqueSkills = (uniqueSkills) => {
        const unique = JSON.stringify(uniqueSkills)
    
        return fetch('http://localhost:8001/skills', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: unique
        })
    }

    const filterClasses = (searchString) => {
        getClasses().then(res => {
            let classesArray = []
            let flattenedClasses = [].concat.apply([], res)
            for (let i = 0; i < flattenedClasses.length; i++) {
                for (let j = 0; j < flattenedClasses[i].classificationId.length; j++) {
                    console.log(flattenedClasses[i].classificationId)
                    if (flattenedClasses[i].classificationType[j] === "SKILL" && flattenedClasses[i].classificationName[j] === searchString){
                        classesArray.push(flattenedClasses[i])
                    }
            }
        }
            console.log(classesArray)
            }
        )
    }

const getClasses = () => {
    return fetch("http://localhost:8000/classes")
        .then(res => res.json())
        .then(parsedData => allClasses = parsedData)
}